import { Observable } from "rxjs";
import { LevelUp } from "levelup";
import { Codec } from "./index";
declare type _TableStreamEntry<V> = {
    key: string;
    type: string;
    doneResolver: (k: string) => void;
};
export declare type TableStreamEntry<V> = (_TableStreamEntry<V> & {
    value: V;
    type: 'put';
}) | (_TableStreamEntry<V> & {
    type: 'del';
});
export declare type TableRecord<V> = {
    key: string;
    value: V;
};
export declare class Table<V> {
    readonly name: string;
    readonly db: Promise<LevelUp<any>>;
    readonly codec: Codec<V>;
    private subject;
    constructor(name: string, db: Promise<LevelUp<any>>, codec: Codec<V>);
    private onEntry;
    getStream: () => Observable<TableStreamEntry<V>>;
    put: (key: string, value: V) => Promise<string>;
    get: (key: string) => Observable<V | undefined>;
    rangeSync: (fromKey: string, toKey?: string | undefined, limit?: number, reverse?: boolean) => Promise<TableRecord<V>[]>;
    toJSON(): {
        resourceType: string;
        name: string;
    };
}
export {};
//# sourceMappingURL=Table.d.ts.map