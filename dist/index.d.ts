export { default as DbBasePath } from "./database/DbBasePath";
export type { TableRecord } from './table/Table';
export * from './table/TableStreamEntry';
export { buildTable, TableBuilder } from './table/buildTable';
export type { OrEmpty, Operation } from './operations/Operation';
export { BasicOperation } from "./operations/BasicOperation";
export { registerOperation } from "./operations/operationRegistry";
export * from "./operations/built-in/headOps";
export * from "./operations/built-in/tableOps";
export * from "./operations/built-in/idOps";
export * from "./operations/built-in/abstractOps";
export * from "./operations/built-in/endOps";
export { buildOpStream, BasicOperationStream, OperationStream } from './execution/OperationStream';
export { rehydrateOpStream } from "./serialization/index";
export { fetchSimpleDb } from './network/http/http-client';
export { default as startStreamingServer } from './network/socket/socket-api';
export { default as NetworkStream } from './network/socket/socket-client';
export { SecurityError } from './security/Security';
/** @deprecated use browser-or-node */
export declare const IS_BROWSER: boolean;
export { TableStreamEntry } from "./table/TableStreamEntry";
export { TablePutEntry } from "./table/TableStreamEntry";
//# sourceMappingURL=index.d.ts.map