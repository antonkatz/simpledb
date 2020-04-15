"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const browser_or_node_1 = require("browser-or-node");
var DbBasePath_1 = require("./database/DbBasePath");
exports.DbBasePath = DbBasePath_1.default;
__export(require("./table/TableStreamEntry"));
var buildTable_1 = require("./table/buildTable");
exports.buildTable = buildTable_1.buildTable;
exports.TableBuilder = buildTable_1.TableBuilder;
var BasicOperation_1 = require("./operations/BasicOperation");
exports.BasicOperation = BasicOperation_1.BasicOperation;
var operationRegistry_1 = require("./operations/operationRegistry");
exports.registerOperation = operationRegistry_1.registerOperation;
__export(require("./operations/built-in/headOps"));
__export(require("./operations/built-in/tableOps"));
__export(require("./operations/built-in/idOps"));
__export(require("./operations/built-in/abstractOps"));
__export(require("./operations/built-in/endOps"));
var OperationStream_1 = require("./execution/OperationStream");
exports.buildOpStream = OperationStream_1.buildOpStream;
exports.BasicOperationStream = OperationStream_1.BasicOperationStream;
var index_1 = require("./serialization/index");
exports.rehydrateOpStream = index_1.rehydrateOpStream;
var http_client_1 = require("./network/http/http-client");
exports.fetchSimpleDb = http_client_1.fetchSimpleDb;
var socket_api_1 = require("./network/socket/socket-api");
exports.startStreamingServer = socket_api_1.default;
var socket_client_1 = require("./network/socket/socket-client");
exports.NetworkStream = socket_client_1.default;
var Security_1 = require("./security/Security");
exports.SecurityError = Security_1.SecurityError;
// export const IS_BROWSER = typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs
/** @deprecated use browser-or-node */
exports.IS_BROWSER = browser_or_node_1.isBrowser;
console.log("IS_BROWSER", exports.IS_BROWSER);
