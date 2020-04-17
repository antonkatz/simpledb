"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
let operationRegistry = immutable_1.Map();
function getRegisteredOperation(opName) {
    return operationRegistry.get(opName);
}
exports.getRegisteredOperation = getRegisteredOperation;
// fixme. use constructor name
function registerOperation(op) {
    operationRegistry = operationRegistry.set(op.name, op);
    return new op();
}
exports.registerOperation = registerOperation;
