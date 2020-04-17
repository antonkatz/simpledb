"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rehydrate_1 = require("./rehydrate");
function rehydrateOpStreamFromJson(json) {
    return rehydrate_1.rehydrate(JSON.parse(json));
}
exports.rehydrateOpStreamFromJson = rehydrateOpStreamFromJson;
