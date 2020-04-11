import {concat, Observable, Subject, from, bindNodeCallback, fromEvent} from "rxjs"
import {LevelUp} from "levelup"
import {filter, map} from "rxjs/operators"
import {Codec, StringCodec} from "./index"
import {AbstractIterator} from "abstract-leveldown"

type _TableStreamEntry<V> = { key: string, type: string, doneResolver: (k: string) => void }
export type TablePutEntry<V> = (_TableStreamEntry<V> & {value: V, type: 'put'})
export type TableStreamEntry<V> = TablePutEntry<V> | (_TableStreamEntry<V> & {type: 'del'})

export type TableRecord<V> = {key: string, value: V}

export class Table<V> {
    private subject: Subject<TableStreamEntry<V>> = new Subject()

    constructor(readonly name: string, readonly db: Promise<LevelUp<any>>, readonly codec: Codec<V>) {
        this.subject.subscribe(e => {
            const opPromise = this.onEntry(e)
            notifyEnteree(e, opPromise)
        })
    }

    private onEntry(entry: TableStreamEntry<V>): Promise<string> {
        if (entry.type === 'del') {
            const opRes = this.db.then(db => db.del(entry.key))
            return Promise.resolve(entry.key)
        } else if (entry.type === "put") {
            const opRes = this.db.then(db =>
                db.put(entry.key, this.codec.dehydrate(entry.value)).then(() => entry.key))
            return opRes
        }

        throw new Error('More operation types than accounted for in TableApi')
    }

    getStream = () => this.subject.asObservable()

    put = (key: string, value: V) => {
        return new Promise<string>((doneResolver: (k: string) => void) => {
            // console.debug('Putting', key, value)
            this.subject.next({key, value, type: 'put', doneResolver})
        })
    }

    get = (key: string): Observable<V | undefined> => {
        console.log(`Table [${this.name}] getting key '${key}' `)
        const existing = this.db.then(db => db.get(key))
            .then(this.codec.rehydrate)
            .catch(e => {
                // throw new Error(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                // console.debug(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                return undefined
            })

        const updateStream = this.subject.pipe(
            filter(e => e.key === key),
            map(mapEntryStreamToEntry)
        )

        // this prevents race conditions, making sure the freshest value is emitted last
        let hasNewValue = false
        const pendingState: Observable<V | undefined> = new Observable(sub => {
            updateStream.subscribe(v => {
                hasNewValue = true
                sub.next(v)
            })
            existing.then(v => {
                if (!hasNewValue) sub.next(v)
                sub.complete()
            })
        })

        return concat(pendingState, updateStream)
    }

    rangeSync = async (fromKey: string, toKey?: string, limit= 1, reverse: boolean = false)
        : Promise<TableRecord<V>[]> => {
        const stream =  (await this.db).createReadStream({
            gt: fromKey, lt: toKey, limit, reverse
        })

        let res: (v: any) => void
        const p = new Promise<{key: string, value: V}[]>(_res => res = _res)
        const result: {key: string, value: V}[] = []

        stream.on('data', row => {
            const key = StringCodec.rehydrate(row.key)
            const value = this.codec.rehydrate(row.value)
            result.push({key, value})

            console.log(`rangeSync got row: ${key}\n\t`, JSON.stringify(value))
        })

        stream.on('end', () => {
            console.debug('rangeSync got `end`')
            res(result)
        })
        stream.resume()

        return p
    }

    toJSON() {
        return {resourceType: 'table', name: this.name}
    }
}

function notifyEnteree(entry: TableStreamEntry<any>, opPromise: Promise<any>) {
    opPromise.then(entry.doneResolver)
}

/** The entries should already be filtered based on key */
function mapEntryStreamToEntry<V>(entry: TableStreamEntry<V>) {
    if (entry.type === 'put') {
        return entry.value
    } else if (entry.type === 'del') {
        return undefined
    }
    return
}
