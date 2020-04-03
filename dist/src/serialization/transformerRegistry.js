"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operationTransformer_1 = require("./operationTransformer");
var tableTransformer_1 = require("./tableTransformer");
var transformerRegistry = [
    tableTransformer_1.objToTable,
    operationTransformer_1.objToOp,
];
exports.default = transformerRegistry;
