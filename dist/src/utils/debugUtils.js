"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fp_1 = require("lodash/fp");
function _debugWatcher(table, e) {
    if (process && process.env && process.env.NODE_ENV !== 'production')
        console.debug(table.name);
    console.debug(JSON.stringify(e, null, 2));
}
exports.debugWatcher = fp_1.curry(_debugWatcher);
