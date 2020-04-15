import {concat, Observable, Subject, Subscription} from "rxjs"
import {LevelUp}                                   from "levelup"
import {filter, map, tap, first}                          from "rxjs/operators"
import {Codec, StringCodec}                        from "./Codec";
import {Maybe, None}                               from "monet";
import {TableStreamEntry}                          from "./TableStreamEntry";

export type TableRecord<V> = {key: string, value: V}

export class Table<V> {
    private subject: Subject<TableStreamEntry<V>> = new Subject();
    private entryStream = this.subject.asObservable();
    private subscription: Maybe<Subscription> = None()

    constructor(readonly name: string, readonly db: Promise<LevelUp<any>>, readonly codec: Codec<V>) {
        this.replaceEntryStream(this.entryStream)
    }

    private replaceEntryStream(newStream: Observable<TableStreamEntry<V>>) {
        this.subscription.forEach(_ => _.unsubscribe())

        this.entryStream = newStream
        const sub = this.entryStream.subscribe(e => {
            this.onEntry(e).then(e.doneResolver).catch(() => e.doneResolver(undefined))
        })
        this.subscription = Maybe.fromNull(sub)
    }

    private onEntry(entry: TableStreamEntry<V>): Promise<string> {
        if (entry.type === 'del') {
            return this.db.then(db => db.del(entry.key)).then(() => entry.key)
        } else if (entry.type === "put") {
            return this.db.then(db =>
                db.put(entry.key, this.codec.dehydrate(entry.value)).then(() => entry.key))
        }

        throw new Error('More operation types than accounted for in TableApi')
    }

    put = (key: string, value: V) => {
        return new Promise<string>((doneResolver: (k: string | undefined) => void) => {
            // console.debug('Putting', key, value)
            this.subject.next({key, value, type: 'put', doneResolver})
        })
    };

    del = (key: string) => {
        return new Promise<string>((doneResolver: (k: string | undefined) => void) => {
            // console.debug('Deleting', key)
            this.subject.next({key, type: 'del', doneResolver})
        })
    };

    get = (key: string): Observable<V | undefined> => {
        console.log(`Table [${this.name}] getting key '${key}' `);
        const existing = this.db.then(db => db.get(key))
            .then(this.codec.rehydrate)
            .catch(e => {
                // throw new Error(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                // console.debug(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                return undefined
            });

        const updateStream = this.subject.pipe(
            filter(e => e.key === key),
            map(mapEntryStreamToValue)
        );

        // this prevents race conditions, making sure the freshest value is emitted last
        let hasNewValue = false;
        const pendingState: Observable<V | undefined> = new Observable(sub => {
            updateStream.subscribe(v => {
                hasNewValue = true;
                sub.next(v)
            });
            existing.then(v => {
                if (!hasNewValue) sub.next(v);
                sub.complete()
            })
        });

        return concat(pendingState, updateStream)
    };

    getSync = (key: string): Promise<V | undefined> => {
        return this.get(key).pipe(
            first()
        ).toPromise()
    }

    rangeSync = async (fromKey?: string, toKey?: string, limit= 1, reverse: boolean = false)
        : Promise<TableRecord<V>[]> => {
        const stream =  (await this.db).createReadStream({
            gt: fromKey, lt: toKey, limit, reverse
        });

        let res: (v: any) => void;
        const p = new Promise<{key: string, value: V}[]>(_res => res = _res);
        const result: {key: string, value: V}[] = [];

        stream.on('data', row => {
            const key = StringCodec.rehydrate(row.key);
            const value = this.codec.rehydrate(row.value);
            result.push({key, value});

            console.log(`rangeSync got row: ${key}\n\t`, JSON.stringify(value))
        });

        stream.on('end', () => {
            console.debug('rangeSync got `end`');
            res(result)
        });
        stream.resume();

        return p
    };

    getStream = () => this.subject.asObservable();

    withTransformer = (watcher: (entryStream: Observable<TableStreamEntry<V>>) => Observable<TableStreamEntry<V>>): this => {
        this.replaceEntryStream(watcher(this.entryStream))
        return this
    }

    withWatcher = (watcher: (entry: TableStreamEntry<V>) => void): this => {
        this.getStream().pipe(tap(watcher)).subscribe();
        return this
    }

    toJSON() {
        return {resourceType: 'table', name: this.name}
    }
}

/** The entries should already be filtered based on key */
function mapEntryStreamToValue<V>(entry: TableStreamEntry<V>) {
    if (entry.type === 'put') {
        return entry.value
    } else if (entry.type === 'del') {
        return undefined
    }
    return
}
