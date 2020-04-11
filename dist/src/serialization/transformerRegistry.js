"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operationTransformer_1 = require("./operationTransformer");
const tableTransformer_1 = require("./tableTransformer");
const transformerRegistry = [
    tableTransformer_1.objToTable,
    operationTransformer_1.objToOp,
];
exports.default = transformerRegistry;
