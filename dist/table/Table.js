"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Codec_1 = require("./Codec");
const monet_1 = require("monet");
class Table {
    constructor(name, db, codec) {
        this.name = name;
        this.db = db;
        this.codec = codec;
        this.subject = new rxjs_1.Subject();
        this.entryStream = this.subject.asObservable();
        this.subscription = monet_1.None();
        this.put = (key, value) => {
            return new Promise((doneResolver) => {
                // console.debug('Putting', key, value)
                this.subject.next({ key, value, type: 'put', doneResolver });
            });
        };
        this.del = (key) => {
            return new Promise((doneResolver) => {
                // console.debug('Deleting', key)
                this.subject.next({ key, type: 'del', doneResolver });
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
            const updateStream = this.subject.pipe(operators_1.filter(e => e.key === key), operators_1.map(mapEntryStreamToValue));
            // this prevents race conditions, making sure the freshest value is emitted last
            let hasNewValue = false;
            const pendingState = new rxjs_1.Observable(sub => {
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
            return rxjs_1.concat(pendingState, updateStream);
        };
        this.getSync = (key) => {
            return this.get(key).pipe(operators_1.first()).toPromise();
        };
        this.rangeSync = async (fromKey, toKey, limit = 1, reverse = false) => {
            const stream = (await this.db).createReadStream({
                gt: fromKey, lt: toKey, limit, reverse
            });
            let res;
            const p = new Promise(_res => res = _res);
            const result = [];
            stream.on('data', row => {
                const key = Codec_1.StringCodec.rehydrate(row.key);
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
        this.clear = () => {
            this.db.then(_ => _.clear());
        };
        this.getStream = () => this.subject.asObservable();
        this.withTransformer = (watcher) => {
            this.replaceEntryStream(watcher(this.entryStream));
            return this;
        };
        this.withWatcher = (watcher) => {
            this.getStream().pipe(operators_1.tap(watcher)).subscribe();
            return this;
        };
        this.replaceEntryStream(this.entryStream);
    }
    replaceEntryStream(newStream) {
        this.subscription.forEach(_ => _.unsubscribe());
        this.entryStream = newStream;
        const sub = this.entryStream.subscribe(e => {
            this.onEntry(e).then(e.doneResolver).catch(() => e.doneResolver(undefined));
        });
        this.subscription = monet_1.Maybe.fromNull(sub);
    }
    onEntry(entry) {
        if (entry.type === 'del') {
            return this.db.then(db => db.del(entry.key)).then(() => entry.key);
        }
        else if (entry.type === "put") {
            return this.db.then(db => db.put(entry.key, this.codec.dehydrate(entry.value)).then(() => entry.key));
        }
        throw new Error('More operation types than accounted for in TableApi');
    }
    toJSON() {
        return { resourceType: 'table', name: this.name };
    }
}
exports.Table = Table;
/** The entries should already be filtered based on key */
function mapEntryStreamToValue(entry) {
    if (entry.type === 'put') {
        return entry.value;
    }
    else if (entry.type === 'del') {
        return undefined;
    }
    return;
}
