import { Observable } from "rxjs";
import { LevelUp } from "levelup";
import { Codec } from "./Codec";
import { TableStreamEntry } from "./TableStreamEntry";
import { Patch } from "immer";
export declare type TableRecord<V> = {
    key: string;
    value: V;
};
export declare class Table<V> {
    readonly name: string;
    readonly db: Promise<LevelUp<any>>;
    readonly codec: Codec<V>;
    private subject;
    private entryStream;
    private subscription;
    private transientState;
    constructor(name: string, db: Promise<LevelUp<any>>, codec: Codec<V>);
    private replaceEntryStream;
    private onEntry;
    private updateTransient;
    private commitTransient;
    private flushTransient;
    /** @deprecated for internal use only; use `patch` instead; put will become private */
    put: (key: string, value: V) => Promise<string | undefined>;
    patch: (key: string, patch: Patch[], onExistingOnly?: boolean) => void;
    del: (key: string) => Promise<string | undefined>;
    get: (key: string) => Observable<V | undefined>;
    getSync: (key: string) => Promise<V | undefined>;
    rangeSync: (fromKey?: string | undefined, toKey?: string | undefined, limit?: number, reverse?: boolean) => Promise<TableRecord<V>[]>;
    clear: () => void;
    getStream: () => Observable<TableStreamEntry<V>>;
    withTransformer: (watcher: (entryStream: Observable<TableStreamEntry<V>>) => Observable<TableStreamEntry<V>>) => this;
    withWatcher: (watcher: (entry: TableStreamEntry<V>) => void) => this;
    toJSON(): {
        resourceType: string;
        name: string;
    };
}
//# sourceMappingURL=Table.d.ts.map