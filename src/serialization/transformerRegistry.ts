import {objToTable}  from "./tableTransformer";
import {objToOp}     from "./operationTransformer";
import {objToStream} from "./operationStreamTransformer";

export const transformerRegistry = [
    objToTable,
    objToOp,
    objToStream
]
