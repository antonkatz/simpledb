export {default as DbBasePath} from "./database/DbBasePath"

export type {TableRecord}         from './table/Table'
export *                          from './table/TableStreamEntry'
export {buildTable, TableBuilder} from './table/buildTable'

export type {OrEmpty, Operation} from './operations/Operation'
export {BasicOperation}          from "./operations/BasicOperation";
export {registerOperation}       from "./operations/operationRegistry"

export * from "./operations/built-in/headOps"
export * from "./operations/built-in/tableOps"
export * from "./operations/built-in/idOps"
export * from "./operations/built-in/abstractOps"
export * from "./operations/built-in/endOps"

export {buildOpStream, BasicOperationStream, OperationStream} from './execution/OperationStream'
export {rehydrateOpStream}                                    from "./serialization/index"

export {fetchSimpleDb}                   from './network/http/http-client'
export type {ExactOrVoid}                from './network/socket/socket-client'
export {default as startStreamingServer} from './network/socket/socket-api'
export {default as NetworkStream}        from './network/socket/socket-client'
export {ConnectionContext}               from './network/socket/ConnectionContext'

export {SecurityError} from './security/Security'

export {IS_BROWSER} from './utils'

export {TableStreamEntry} from "./table/TableStreamEntry";
export {TablePutEntry}    from "./table/TableStreamEntry";

import {enablePatches} from "immer";
enablePatches()
