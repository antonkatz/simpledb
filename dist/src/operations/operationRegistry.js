import { Map } from "immutable";
let operationRegistry = Map();
export function getRegisteredOperation(opName) {
    return operationRegistry.get(opName);
}
// export function registerOperation(builder: () => OperationInstance<any, any, any>) {
// fixme. use constructor name
export function registerOperation(op) {
    console.log('registering', op.name);
    operationRegistry = operationRegistry.set(op.name, op);
}
