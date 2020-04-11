"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const levelup_1 = __importDefault(require("levelup"));
const Table_1 = require("./Table");
const tableRegistry_1 = require("./tableRegistry");
const globalBasePath_1 = require("./globalBasePath");
exports.globalBasePath = globalBasePath_1.globalBasePath;
var headOps_1 = require("./operations/headOps");
exports.HeadOp = headOps_1.HeadOp;
var tableOps_1 = require("./operations/tableOps");
exports.TableGetOp = tableOps_1.TableGetOp;
exports.TablePutOp = tableOps_1.TablePutOp;
exports.TableFilterNotExists = tableOps_1.TableFilterNotExists;
exports.TableGetForUpdate = tableOps_1.TableGetForUpdate;
var idOps_1 = require("./operations/idOps");
exports.TrackMaxIdOp = idOps_1.TrackMaxIdOp;
exports.WithIdAsTableKeyOp = idOps_1.WithIdAsTableKeyOp;
var abstractOps_1 = require("./operations/abstractOps");
exports.UpdateRecordOp = abstractOps_1.UpdateRecordOp;
var http_client_1 = require("./network/http/http-client");
exports.fetchSimpleDb = http_client_1.fetchSimpleDb;
var socket_api_1 = require("./network/socket/socket-api");
exports.startStreamingServer = socket_api_1.default;
var socket_client_1 = require("./network/socket/socket-client");
exports.NetworkStream = socket_client_1.default;
var Operation_1 = require("./operations/Operation");
exports.BasicOperation = Operation_1.BasicOperation;
var OperationStream_1 = require("./execution/OperationStream");
exports.buildOpStream = OperationStream_1.buildOpStream;
exports.BasicOperationStream = OperationStream_1.BasicOperationStream;
var index_1 = require("./serialization/index");
exports.rehydrateOpStream = index_1.rehydrateOpStream;
var operationRegistry_1 = require("./operations/operationRegistry");
exports.registerOperation = operationRegistry_1.registerOperation;
var Security_1 = require("./Security");
exports.SecurityError = Security_1.SecurityError;
const base64_1 = require("./network/socket/base64");
// @ts-ignore
exports.IS_BROWSER = typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs;
console.log("IS_BROWSER", exports.IS_BROWSER);
if (exports.IS_BROWSER) {
    console.warn('Empty DB_ADAPTER');
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve("empty");
    exports.ID_DIGEST = what => {
        // @ts-ignore
        if (!crypto.subtle.digest)
            throw new Error('Browser is too old to support hashing');
        // @ts-ignore
        return crypto.subtle.digest("SHA-256", new TextEncoder().encode(what)).then((hashBuffer) => {
            const arr = Array.from(new Uint8Array(hashBuffer));
            return base64_1.bytesToBase64(arr);
        });
    };
}
else {
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve().then(() => __importStar(require("leveldown"))).then(imp => imp.default);
    exports.ID_DIGEST = what => Promise.resolve().then(() => __importStar(require('crypto'))).then(crypto => crypto.createHash('sha256').update(what).digest('base64'));
}
exports.DB_STRING_API_BUILDER = DbStringApiBuilder(exports.DB_ADAPTER);
exports.TableBuilder = DbApiBuilder(exports.DB_ADAPTER);
exports.StringCodec = {
    dehydrate: v => v,
    rehydrate: raw => raw.toString()
};
function buildJsonCodec() {
    return {
        dehydrate: v => JSON.stringify(v),
        rehydrate: raw => JSON.parse(raw.toString())
    };
}
exports.buildJsonCodec = buildJsonCodec;
function DbStringApiBuilder(levelAdapter) {
    return (options) => buildTable(levelAdapter, exports.StringCodec, options.basePath || './db', options);
}
exports.DbStringApiBuilder = DbStringApiBuilder;
function DbApiBuilder(levelAdapter) {
    return (options, codec) => {
        const relPath = options.basePath || './db';
        return buildTable(levelAdapter, codec, relPath, options);
    };
}
exports.DbApiBuilder = DbApiBuilder;
function buildTable(adapter, codec, relPath, options) {
    const db = globalBasePath_1.globalBasePath.path.then(async (basePath) => {
        const _a = await adapter;
        const path = basePath + relPath + '-' + options.name;
        console.debug('Opening DB on path ' + path);
        const _db = _a(path);
        return levelup_1.default(_db);
    });
    // todo. indexes will have their own tables created
    const table = new Table_1.Table(options.name, db, codec);
    tableRegistry_1.registerTable(options.name, table);
    return table;
}
