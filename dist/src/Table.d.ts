import { Observable } from "rxjs";
import { LevelUp } from "levelup";
import { Codec } from "./index";
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
    put: (key: string, value: V) => Promise<string>;
    get: (key: string) => Observable<V | undefined>;
    rangeSync: (fromKey: string, toKey?: string | undefined, limit?: number, reverse?: boolean) => Promise<TableRecord<V>[]>;
    toJSON(): {
        resourceType: string;
        name: string;
    };
}
//# sourceMappingURL=Table.d.ts.map