"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var levelup_1 = __importDefault(require("levelup"));
var Table_1 = require("./Table");
var tableRegistry_1 = require("./tableRegistry");
var globalBasePath_1 = require("./globalBasePath");
exports.globalBasePath = globalBasePath_1.globalBasePath;
var headOps_1 = require("./operations/headOps");
exports.HeadOp = headOps_1.HeadOp;
var tableOps_1 = require("./operations/tableOps");
exports.TableGetOp = tableOps_1.TableGetOp;
exports.TablePutOp = tableOps_1.TablePutOp;
exports.TableFilterNotExists = tableOps_1.TableFilterNotExists;
var idOps_1 = require("./operations/idOps");
exports.TrackMaxIdOp = idOps_1.TrackMaxIdOp;
exports.WithIdAsTableKeyOp = idOps_1.WithIdAsTableKeyOp;
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
var base64_1 = require("./network/socket/base64");
// @ts-ignore
exports.IS_BROWSER = typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs;
if (exports.IS_BROWSER) {
    console.warn('Empty DB_ADAPTER');
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve("empty");
    exports.ID_DIGEST = function (what) {
        // @ts-ignore
        if (!crypto.subtle.digest)
            throw new Error('Browser is too old to support hashing');
        // @ts-ignore
        return crypto.subtle.digest("SHA-256", new TextEncoder().encode(what)).then(function (hashBuffer) {
            var arr = Array.from(new Uint8Array(hashBuffer));
            return base64_1.bytesToBase64(arr);
        });
    };
}
else {
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve().then(function () { return __importStar(require("leveldown")); }).then(function (imp) { return imp.default; });
    exports.ID_DIGEST = function (what) { return Promise.resolve().then(function () { return __importStar(require('crypto')); }).then(function (crypto) { return crypto.createHash('sha256').update(what).digest('base64'); }); };
}
exports.DB_STRING_API_BUILDER = DbStringApiBuilder(exports.DB_ADAPTER);
exports.TableBuilder = DbApiBuilder(exports.DB_ADAPTER);
exports.StringCodec = {
    dehydrate: function (v) { return v; },
    rehydrate: function (raw) { return raw.toString(); }
};
function buildJsonCodec() {
    return {
        dehydrate: function (v) { return JSON.stringify(v); },
        rehydrate: function (raw) { return JSON.parse(raw.toString()); }
    };
}
exports.buildJsonCodec = buildJsonCodec;
function DbStringApiBuilder(levelAdapter) {
    return function (options) { return buildTable(levelAdapter, exports.StringCodec, options.basePath || './db', options); };
}
exports.DbStringApiBuilder = DbStringApiBuilder;
function DbApiBuilder(levelAdapter) {
    return function (options, codec) {
        var relPath = options.basePath || './db';
        return buildTable(levelAdapter, codec, relPath, options);
    };
}
exports.DbApiBuilder = DbApiBuilder;
function buildTable(adapter, codec, relPath, options) {
    var _this = this;
    var db = globalBasePath_1.globalBasePath.path.then(function (basePath) { return __awaiter(_this, void 0, void 0, function () {
        var _a, path, _db;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, adapter];
                case 1:
                    _a = _b.sent();
                    path = basePath + relPath + '-' + options.name;
                    console.debug('Opening DB on path ' + path);
                    _db = _a(path);
                    return [2 /*return*/, levelup_1.default(_db)];
            }
        });
    }); });
    // todo. indexes will have their own tables created
    var table = new Table_1.Table(options.name, db, codec);
    tableRegistry_1.registerTable(options.name, table);
    return table;
}
