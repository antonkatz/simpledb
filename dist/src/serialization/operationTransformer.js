"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const operationRegistry_1 = require("../operations/operationRegistry");
function objToOp(raw) {
    if (raw.opName) {
        const op = operationRegistry_1.getRegisteredOperation(raw.opName);
        if (op) {
            const ctx = raw.ctx && index_1.rehydrate(raw.ctx);
            return new op().withContext(ctx); // fixme get back an instance instead of a constructor
        }
        else {
            throw new Error(`Unregistered operation: '${raw.opName}'`);
        }
    }
    return undefined;
}
exports.objToOp = objToOp;
