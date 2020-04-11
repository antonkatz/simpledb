"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const OperationStream_1 = require("../execution/OperationStream");
const transformerRegistry_1 = __importDefault(require("./transformerRegistry"));
function rehydrateOpStreamFromJson(json) {
    return rehydrateOpStream(JSON.parse(json));
}
exports.rehydrateOpStreamFromJson = rehydrateOpStreamFromJson;
function rehydrateOpStream(dehydratedOpStream) {
    if (Array.isArray(dehydratedOpStream.chain)) {
        const chain = immutable_1.List(dehydratedOpStream.chain.map(rehydrate));
        const ctx = rehydrate(dehydratedOpStream.ctx || {});
        return new OperationStream_1.BasicOperationStream(chain, ctx);
    }
    throw new Error('Stream must be represented as array');
}
exports.rehydrateOpStream = rehydrateOpStream;
function rehydrate(raw) {
    if (raw && typeof raw === 'object') {
        for (const trans of transformerRegistry_1.default) {
            const res = trans(raw);
            if (res) {
                return res;
            }
        }
        const assembled = Array.isArray(raw) ? [] : {};
        for (const k of Object.keys(raw)) {
            // @ts-ignore
            assembled[k] = rehydrate(raw[k]);
        }
        return assembled;
    }
    else {
        return raw;
    }
}
exports.rehydrate = rehydrate;
