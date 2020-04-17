"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transformerRegistry_1 = require("./transformerRegistry");
function rehydrate(raw) {
    if (raw && typeof raw === 'object') {
        for (const trans of transformerRegistry_1.transformerRegistry) {
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
