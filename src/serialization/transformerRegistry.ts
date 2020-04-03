import {objToOp} from "./operationTransformer"
import {objToTable} from "./tableTransformer"

const transformerRegistry = [
    objToTable,
    objToOp,
]

export default transformerRegistry