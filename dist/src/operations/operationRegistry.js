"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
let operationRegistry = immutable_1.Map();
function getRegisteredOperation(opName) {
    return operationRegistry.get(opName);
}
exports.getRegisteredOperation = getRegisteredOperation;
// export function registerOperation(builder: () => OperationInstance<any, any, any>) {
// fixme. use constructor name
function registerOperation(op) {
    console.log('registering', op.name);
    operationRegistry = operationRegistry.set(op.name, op);
    return new op();
}
exports.registerOperation = registerOperation;
