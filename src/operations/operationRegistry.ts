import {Map}                     from "immutable"
import {OmitIntoVoid, Operation} from "./Operation"
import {BasicOperation}          from "./BasicOperation";

let operationRegistry = Map<string, new () => Operation<any, any, any>>()

export function getRegisteredOperation(opName: string) {
    return operationRegistry.get(opName)
}

// fixme. use constructor name
export function registerOperation<In, Out, Ctx, Op extends BasicOperation<In, Out, Ctx>>(op: new () => Op): Op {
    operationRegistry = operationRegistry.set(op.name, op)

    return new op()
}
