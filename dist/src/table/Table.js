"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Codec_1 = require("./Codec");
const monet_1 = require("monet");
const immer_1 = require("immer");
class Table {
    constructor(name, db, codec) {
        this.name = name;
        this.db = db;
        this.codec = codec;
        this.subject = new rxjs_1.Subject();
        this.entryStream = this.subject.asObservable();
        this.subscription = monet_1.None();
        this.transientState = new Map();
        /** @deprecated for internal use only; use `patch` instead; put will become private */
        this.put = (key, value) => {
            return new Promise((doneResolver) => {
                // console.debug('Putting', key, value)
                this.subject.next({ key, value, type: 'put', doneResolver });
            });
        };
        // todo. `create` function that only executes if no record is present
        this.overwrite = this.put;
        this.patch = (key, patch, onExistingOnly = true) => {
            // onExistingOnly prevents a delete -> create (when no new object should be created)
            let transient = this.transientState.get(key);
            if (transient) {
                if (onExistingOnly && transient.value === null)
                    return Promise.reject('Key exists');
                return this.patchTransient(key, patch, transient);
            }
            else {
                return this.getSync(key).then(value => {
                    transient = this.transientState.get(key);
                    if (!transient) {
                        if (onExistingOnly && (value === null))
                            return Promise.reject('Key exists');
                        const updated = immer_1.applyPatches(value || {}, patch);
                        return this.put(key, updated);
                    }
                    else {
                        if (onExistingOnly && (transient.value === null))
                            return Promise.reject('Key exists');
                        return this.patchTransient(key, patch, transient);
                    }
                });
            }
        };
        this.del = (key) => {
            return new Promise((doneResolver) => {
                // console.debug('Deleting', key)
                this.subject.next({ key, type: 'del', doneResolver });
            });
        };
        this.get = (key) => {
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
            //     .pipe(
            //     map(v => {
            //         let transient = this.transientState.get(key)
            //         if (transient) return transient.value || undefined
            //         return v
            //     })
            // )
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
            this.onEntry(e).then(() => e.doneResolver(e.key)).catch(() => e.doneResolver(undefined));
        });
        this.subscription = monet_1.Maybe.fromNull(sub);
    }
    onEntry(entry) {
        let res;
        let transientUpdate;
        if (entry.type === 'del') {
            transientUpdate = null;
        }
        else if (entry.type === 'put') {
            transientUpdate = entry.value;
        }
        else {
            throw new Error('More operation types than accounted for in TableApi');
        }
        const { version, promise } = this.updateTransient(entry.key, transientUpdate);
        if (version === 0) {
            if (entry.type === 'del') {
                res = this.db.then(db => db.del(entry.key));
            }
            else if (entry.type === "put") {
                res = this.db.then(db => db.put(entry.key, this.codec.dehydrate(entry.value)));
            }
        }
        else {
            return promise;
        }
        if (!res) {
            throw new Error("Impossible condition in Table `onEntry`. Probably a bug");
        }
        res.finally(() => {
            // fixme does not account for errors yet
            this.flushTransient(entry.key, version);
        });
        return res;
    }
    updateTransient(key, value) {
        const existing = this.transientState.get(key);
        if (existing) {
            const updated = { ...existing, value, version: existing.version + 1 };
            this.transientState.set(key, updated);
            return updated;
        }
        else {
            let resolver = null;
            const promise = new Promise(res => {
                resolver = res;
            });
            if (!resolver) {
                throw new Error("Impossible condition in Table `updateTransient`. Probably a bug");
            }
            const newEntry = { version: 0, value, promise, resolver };
            this.transientState.set(key, newEntry);
            return newEntry;
        }
    }
    commitTransient(key, state) {
        if (state.value === null) {
            this.del(key);
        }
        else {
            this.put(key, state.value);
        }
    }
    flushTransient(key, lastVersion) {
        const state = this.transientState.get(key);
        if (!state)
            throw new Error('Impossible condition in Table `flushTransient`. Probably a bug');
        this.transientState.delete(key);
        if (state.version === lastVersion) {
            state.resolver();
        }
        else {
            this.commitTransient(key, state);
        }
    }
    patchTransient(key, patch, entry) {
        const updated = immer_1.applyPatches(entry.value || {}, patch);
        const { promise } = this.updateTransient(key, updated);
        return promise.then(() => key).catch(() => undefined);
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
