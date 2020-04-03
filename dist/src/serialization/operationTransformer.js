"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var operationRegistry_1 = require("../operations/operationRegistry");
function objToOp(raw) {
    if (raw.opName) {
        var op = operationRegistry_1.getRegisteredOperation(raw.opName);
        if (op) {
            var ctx = raw.ctx && index_1.rehydrate(raw.ctx);
            return new op().withContext(ctx);
        }
        else {
            throw new Error('Unregistered operation');
        }
    }
    return undefined;
}
exports.objToOp = objToOp;
