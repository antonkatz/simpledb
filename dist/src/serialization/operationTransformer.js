"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operationRegistry_1 = require("../operations/operationRegistry");
const rehydrate_1 = require("./rehydrate");
function objToOp(raw) {
    if (raw.opName) {
        const op = operationRegistry_1.getRegisteredOperation(raw.opName);
        if (op) {
            const ctx = raw.ctx && rehydrate_1.rehydrate(raw.ctx);
            if (ctx) {
                return new op().withContext(ctx); // fixme get back an instance instead of a constructor
            }
            else {
                return new op();
            }
        }
        else {
            throw new Error(`Unregistered operation: '${raw.opName}'`);
        }
    }
    return undefined;
}
exports.objToOp = objToOp;
