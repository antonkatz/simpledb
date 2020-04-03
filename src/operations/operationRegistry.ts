import {Map} from "immutable"
import {BasicOperation, Operation} from "./Operation"

let operationRegistry = Map<string, new () => Operation<any, any, any>>()

export function getRegisteredOperation(opName: string) {
    return operationRegistry.get(opName)
}

// export function registerOperation(builder: () => OperationInstance<any, any, any>) {
// fixme. use constructor name
export function registerOperation(op: new () => BasicOperation<any, any, any>) {
    console.log('registering', op.name)
    operationRegistry = operationRegistry.set(op.name, op)
}