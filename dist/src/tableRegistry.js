"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
let tableRegistry = immutable_1.Map();
function getRegisteredTable(name) {
    return tableRegistry.get(name);
}
exports.getRegisteredTable = getRegisteredTable;
function registerTable(name, table) {
    console.log(`Registering table ${name}`);
    tableRegistry = tableRegistry.set(name, table);
}
exports.registerTable = registerTable;
