import { concat, Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { StringCodec } from "./index";
export class Table {
    constructor(name, db, codec) {
        this.name = name;
        this.db = db;
        this.codec = codec;
        this.subject = new Subject();
        this.getStream = () => this.subject.asObservable();
        this.put = (key, value) => {
            return new Promise((doneResolver) => {
                // console.debug('Putting', key, value)
                this.subject.next({ key, value, type: 'put', doneResolver });
            });
        };
        this.get = (key) => {
            console.log(`Table [${this.name}] getting key '${key}' `);
            const existing = this.db.then(db => db.get(key))
                .then(this.codec.rehydrate)
                .catch(e => {
                // throw new Error(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                // console.debug(`Could not get from table ${this.name} on key ${key}; ${e.message}`)
                return undefined;
            });
            const updateStream = this.subject.pipe(filter(e => e.key === key), map(mapEntryStreamToEntry));
            // this prevents race conditions, making sure the freshest value is emitted last
            let hasNewValue = false;
            const pendingState = new Observable(sub => {
                updateStream.subscribe(v => {
                    hasNewValue = true;
                    sub.next(v);
                });
                existing.then(v => {
                    if (!hasNewValue)
                        sub.next(v);
                    sub.complete();
                });
            });
            return concat(pendingState, updateStream);
        };
        this.rangeSync = async (fromKey, toKey, limit = 1, reverse = false) => {
            const stream = (await this.db).createReadStream({
                gt: fromKey, lt: toKey, limit, reverse
            });
            let res;
            const p = new Promise(_res => res = _res);
            const result = [];
            stream.on('data', row => {
                const key = StringCodec.rehydrate(row.key);
                const value = this.codec.rehydrate(row.value);
                result.push({ key, value });
                console.log(`rangeSync got row: ${key}\n\t`, JSON.stringify(value));
            });
            stream.on('end', () => {
                console.debug('rangeSync got `end`');
                res(result);
            });
            stream.resume();
            return p;
        };
        this.subject.subscribe(e => {
            const opPromise = this.onEntry(e);
            notifyEnteree(e, opPromise);
        });
    }
    onEntry(entry) {
        if (entry.type === 'del') {
            const opRes = this.db.then(db => db.del(entry.key));
            return Promise.resolve(entry.key);
        }
        else if (entry.type === "put") {
            const opRes = this.db.then(db => db.put(entry.key, this.codec.dehydrate(entry.value)).then(() => entry.key));
            return opRes;
        }
        throw new Error('More operation types than accounted for in TableApi');
    }
    toJSON() {
        return { resourceType: 'table', name: this.name };
    }
}
function notifyEnteree(entry, opPromise) {
    opPromise.then(entry.doneResolver);
}
/** The entries should already be filtered based on key */
function mapEntryStreamToEntry(entry) {
    if (entry.type === 'put') {
        return entry.value;
    }
    else if (entry.type === 'del') {
        return undefined;
    }
    return;
}
