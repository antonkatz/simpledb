"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
exports.IS_BROWSER = typeof process ===
    'undefined' ||
    process.type ===
        'renderer' ||
    process.browser ===
        true ||
    process.__nwjs;
