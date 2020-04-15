import { Codec } from "./Codec";
import { Table } from "./Table";
export declare type DbApiOptions = {
    basePath?: string;
    name: string;
};
/** @deprecated use `buildTable()` instead */
export declare const TableBuilder: <V>(options: DbApiOptions, codec?: Codec<V>) => Table<V>;
export declare const buildTable: <V>(options: DbApiOptions, codec?: Codec<V> | undefined) => Table<V>;
//# sourceMappingURL=buildTable.d.ts.map