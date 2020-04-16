"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
exports.IS_BROWSER = typeof process === 'undefined' ||
    process.type === 'renderer' ||
    process.browser === true ||
    process.__nwjs;
__export(require("./debugUtils"));
