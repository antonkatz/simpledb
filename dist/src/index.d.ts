import { AbstractLevelDOWNConstructor } from "abstract-leveldown";
import { Table } from "./Table";
import { globalBasePath } from "./globalBasePath";
export { globalBasePath };
export type { TableRecord, TableStreamEntry } from './Table';
export { HeadOp } from "./operations/headOps";
export { TableGetOp, TablePutOp, TableFilterNotExists, TableGetForUpdate } from "./operations/tableOps";
export { TrackMaxIdOp, WithIdAsTableKeyOp } from "./operations/idOps";
export { UpdateRecordOp } from "./operations/abstractOps";
export { fetchSimpleDb } from './network/http/http-client';
export { default as startStreamingServer } from './network/socket/socket-api';
export { default as NetworkStream } from './network/socket/socket-client';
export type { OrEmpty, Operation } from './operations/Operation';
export { BasicOperation } from "./operations/Operation";
export { buildOpStream, BasicOperationStream, OperationStream } from './execution/OperationStream';
export { rehydrateOpStream } from "./serialization/index";
export { registerOperation } from "./operations/operationRegistry";
export { SecurityError } from './Security';
export declare let DB_ADAPTER: Promise<AbstractLevelDOWNConstructor>;
export declare let ID_DIGEST: (what: string) => PromiseLike<string>;
export declare const IS_BROWSER: any;
export declare const DB_STRING_API_BUILDER: (options: DbApiOptions) => Table<string>;
export declare const TableBuilder: <V>(options: DbApiOptions, codec: Codec<V>) => Table<V>;
export declare const StringCodec: Codec<string>;
export declare function buildJsonCodec<V>(): Codec<V>;
export declare function DbStringApiBuilder(levelAdapter: Promise<AbstractLevelDOWNConstructor>): (options: DbApiOptions) => Table<string>;
export declare type Codec<V> = {
    dehydrate: (v: V) => string;
    rehydrate: (raw: Uint8Array) => V;
};
export declare function DbApiBuilder(levelAdapter: Promise<AbstractLevelDOWNConstructor>): <V>(options: DbApiOptions, codec: Codec<V>) => Table<V>;
export declare type DbApiOptions = {
    basePath?: string;
    name: string;
};
//# sourceMappingURL=index.d.ts.map