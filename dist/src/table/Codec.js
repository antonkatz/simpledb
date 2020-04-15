"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringCodec = {
    dehydrate: v => v,
    rehydrate: raw => raw.toString()
};
function buildJsonCodec() {
    return {
        dehydrate: v => JSON.stringify(v),
        rehydrate: raw => JSON.parse(raw.toString())
    };
}
exports.buildJsonCodec = buildJsonCodec;
