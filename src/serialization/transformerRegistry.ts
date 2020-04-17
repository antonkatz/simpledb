import {objToTable}       from "./tableTransformer";
import {objToOp}          from "./operationTransformer";
import {objToStream}      from "./operationStreamTransformer";
import {objToRxjsContext} from "./rxjsContextTransformer";

export const transformerRegistry = [
    objToRxjsContext,
    objToTable,
    objToOp,
    objToStream
]
