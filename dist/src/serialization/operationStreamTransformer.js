"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const __1 = require("..");
const rehydrate_1 = require("./rehydrate");
function objToStream(raw) {
    if (raw.__type === 'basicOperationStream') {
        if (Array.isArray(raw.chain)) {
            const chain = immutable_1.List(raw.chain.map(rehydrate_1.rehydrate));
            const ctx = rehydrate_1.rehydrate(raw.ctx || {});
            return new __1.BasicOperationStream(chain, ctx);
        }
        throw new Error('Stream must be represented as array');
    }
    return undefined;
}
exports.objToStream = objToStream;
