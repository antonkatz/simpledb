import {concat, Observable, of, Subject, Subscription} from "rxjs"
import {LevelUp}                         from "levelup"
import {filter, map, tap, first, reduce} from "rxjs/operators"
import {Codec, StringCodec}              from "./Codec";
import {Maybe, None}                      from "monet";
import {TableStreamEntry, TransientEntry} from "./TableStreamEntry";
import {applyPatches, Patch}              from "immer";

export type TableRecord<V> = {key: string, value: V}

export class Table<V> {
    private subject: Subject<TableStreamEntry<V>> = new Subject();
    private entryStream = this.subject.asObservable();
    private subscription: Maybe<Subscription> = None()

    private transientState = new Map<string, TransientEntry<V>>()

    constructor(readonly name: string, readonly db: Promise<LevelUp<any>>, readonly codec: Codec<V>) {
        this.replaceEntryStream(this.entryStream)
    }

    private replaceEntryStream(newStream: Observable<TableStreamEntry<V>>) {
        this.subscription.forEach(_ => _.unsubscribe())

        this.entryStream = newStream
        const sub = this.entryStream.subscribe(e => {
            this.onEntry(e).then(() => e.doneResolver(e.key)).catch(() => e.doneResolver(undefined))
        })
        this.subscription = Maybe.fromNull(sub)
    }

    private onEntry(entry: TableStreamEntry<V>): Promise<void> {
        let res;

        let transientUpdate: V | null;
        if (entry.type === 'del') {
            transientUpdate = null
        } else if (entry.type === 'put') {
            transientUpdate = entry.value
        } else {
            throw new Error('More operation types than accounted for in TableApi')
        }

        const {version, promise} = this.updateTransient(entry.key, transientUpdate)

        if (version === 0) {
            if (entry.type === 'del') {
                    res = this.db.then(db => db.del(entry.key))
            } else if (entry.type === "put") {
                    res = this.db.then(db =>
                        db.put(entry.key, this.codec.dehydrate(entry.value)))
            }
        } else {
            return promise
        }

        if (!res) {
            throw new Error("Impossible condition in Table `onEntry`. Probably a bug")
        }

        res.finally(() => {
            // fixme does not account for errors yet
            this.flushTransient(entry.key, version)
        })

        return res
    }

    private updateTransient(key: string, value: V | null): TransientEntry<V> {
        const existing = this.transientState.get(key)
        if (existing) {
            const updated = {...existing, value, version: existing.version + 1}
            this.transientState.set(key, updated)
            return updated
        } else {
            let resolver: (() => void) | null = null;
            const promise = new Promise<void>(res => {
                resolver = res
            })
            if (!resolver) {
                throw new Error("Impossible condition in Table `updateTransient`. Probably a bug")
            }

            const newEntry = {version: 0, value, promise, resolver}
            this.transientState.set(key, newEntry)
            return newEntry
        }
    }

    private commitTransient(key: string, state: TransientEntry<V>) {
        if (state.value === null) {
            this.del(key)
        } else {
            this.put(key, state.value)
        }
    }

    private flushTransient(key: string, lastVersion: number) {
        const state = this.transientState.get(key)
        if (!state) throw new Error('Impossible condition in Table `flushTransient`. Probably a bug')

        this.transientState.delete(key)
        if (state.version === lastVersion) {
            state.resolver()
        } else {
            this.commitTransient(key, state)
        }
    }

    /** @deprecated for internal use only; use `patch` instead; put will become private */
    put = (key: string, value: V) => {
        return new Promise<string | undefined>((doneResolver: (k: string | undefined) => void) => {
            // console.debug('Putting', key, value)
            this.subject.next({key, value, type: 'put', doneResolver})
        })
    };

    // todo. `create` function that only executes if no record is present

    overwrite: (key: string, value: V) => Promise<string | undefined> = this.put

    patch = (key: string, patch: Patch[], onExistingOnly: boolean = true): Promise<string | undefined> => {
        // onExistingOnly prevents a delete -> create (when no new object should be created)
        let transient = this.transientState.get(key)
        if (transient) {
            if (onExistingOnly && transient.value === null) return Promise.reject('Key exists')
            return this.patchTransient(key, patch, transient)
        } else {
            return this.getSync(key).then(value => {
                transient = this.transientState.get(key)
                if (!transient) {
                    if (onExistingOnly && (value === null)) return Promise.reject('Key exists')
                    const updated = applyPatches(value || {}, patch)
                    return this.put(key, updated)
                } else {
                    if (onExistingOnly && (transient.value === null)) return Promise.reject('Key exists')
                    return this.patchTransient(key, patch, transient)
                }
            })
        }
    }

    private patchTransient(key: string, patch: Patch[], entry: TransientEntry<V>): Promise<string | undefined> {
        const updated = applyPatches(entry.value || {}, patch)
        const {promise} = this.updateTransient(key, updated)
        return promise.then(() => key).catch(() => undefined)
    }

    del = (key: string) => {
        return new Promise<string | undefined>((doneResolver: (k: string | undefined) => void) => {
            // console.debug('Deleting', key)
            this.subject.next({key, type: 'del', doneResolver})
        })
    };

    get = (key: string): Observable<V | undefined> => {
        console.log(`Table [${this.name}] getting key '${key}' `);
        // let transient = this.transientState.get(key)
        // if (transient) {
        //     return concat(of(transient.value || undefined)
        // }

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
        //     .pipe(
        //     map(v => {
        //         let transient = this.transientState.get(key)
        //         if (transient) return transient.value || undefined
        //         return v
        //     })
        // )
    };

    getSync = (key: string): Promise<V | undefined> => {
        return this.get(key).pipe(
            first()
        ).toPromise()
    }

    range = (fromKey?: string, toKey?: string, limit= 1, reverse: boolean = false): Observable<TableRecord<V>> => {
        const subject = new Subject<TableRecord<V>>()
        this.db.then(_ => _.createReadStream({
            gt: fromKey, lt: toKey, limit, reverse
        })).then(stream => {
            stream.on('data', row => {
                const key = StringCodec.rehydrate(row.key);
                const value = this.codec.rehydrate(row.value);
                subject.next({key, value});
            });

            stream.on('end', () => {
                subject.complete()
            });
            stream.resume();
        })

        return subject.asObservable()
    };

    rangeSync = (fromKey?: string, toKey?: string, limit= 1, reverse: boolean = false)
        : Promise<TableRecord<V>[]> => {
        return this.range().pipe(reduce((acc, v) => {
            acc.push(v)
            return acc
        }, [] as TableRecord<V>[])).toPromise()
    };

    clear = () => {
        this.db.then(_ => _.clear())
    }

    getStream = () => this.entryStream;

    withTransformer = (watcher: (entryStream: Observable<TableStreamEntry<V>>) => Observable<TableStreamEntry<V>>): this => {
        this.replaceEntryStream(watcher(this.entryStream))
        return this
    }

    withWatcher = (watcher: (entry: TableStreamEntry<V>) => void): this => {
        this.replaceEntryStream(this.getStream().pipe(tap(watcher)));
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
