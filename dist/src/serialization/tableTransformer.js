"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tableRegistry_1 = require("../tableRegistry");
function objToTable(obj) {
    if (obj.resourceType === "table" && obj.name) {
        var table = tableRegistry_1.getRegisteredTable(obj.name);
        if (!table) {
            throw new Error('Missing table from table registry');
        }
        return table;
    }
    return;
}
exports.objToTable = objToTable;
