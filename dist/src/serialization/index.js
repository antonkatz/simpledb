"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var OperationStream_1 = require("../execution/OperationStream");
var transformerRegistry_1 = __importDefault(require("./transformerRegistry"));
function rehydrateOpStreamFromJson(json) {
    return rehydrateOpStream(JSON.parse(json));
}
exports.rehydrateOpStreamFromJson = rehydrateOpStreamFromJson;
function rehydrateOpStream(dehydratedOpStream) {
    if (Array.isArray(dehydratedOpStream.chain)) {
        var chain = immutable_1.List(dehydratedOpStream.chain.map(rehydrate));
        var ctx = rehydrate(dehydratedOpStream.ctx || {});
        return new OperationStream_1.BasicOperationStream(chain, ctx);
    }
    throw new Error('Stream must be represented as array');
}
exports.rehydrateOpStream = rehydrateOpStream;
function rehydrate(raw) {
    if (raw && typeof raw === 'object') {
        for (var _i = 0, transformerRegistry_2 = transformerRegistry_1.default; _i < transformerRegistry_2.length; _i++) {
            var trans = transformerRegistry_2[_i];
            var res = trans(raw);
            if (res) {
                return res;
            }
        }
        var assembled = {};
        for (var _a = 0, _b = Object.keys(raw); _a < _b.length; _a++) {
            var k = _b[_a];
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
