import { Observable } from "rxjs";
import { LevelUp } from "levelup";
import { Codec } from "./Codec";
import { TableStreamEntry } from "./TableStreamEntry";
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
    constructor(name: string, db: Promise<LevelUp<any>>, codec: Codec<V>);
    private replaceEntryStream;
    private onEntry;
    put: (key: string, value: V) => Promise<string>;
    del: (key: string) => Promise<string>;
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