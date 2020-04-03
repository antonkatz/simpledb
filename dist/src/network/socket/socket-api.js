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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var serialization_1 = require("../../serialization");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var index_1 = require("../../index");
function startStreamingServer() {
    return __awaiter(this, void 0, void 0, function () {
        var express, http, socketio, cors, app, server, io;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Starting streaming server');
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("express")); }).then(function (i) { return i.default; })];
                case 1:
                    express = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require("http")); }).then(function (i) { return i.default; })];
                case 2:
                    http = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('socket.io')); }).then(function (i) { return i.default; })
                        // @ts-ignore
                    ];
                case 3:
                    socketio = _a.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('cors')); }).then(function (i) { return i.default; })];
                case 4:
                    cors = _a.sent();
                    app = express();
                    app.use(cors);
                    server = http.createServer(app);
                    io = socketio(server, { serveClient: false });
                    io.on('connection', function (socket) {
                        console.log('user connected');
                        var osr = function (ds) { return onStreamRequest(socket, ds); };
                        socket.on('streamRequest', osr);
                    });
                    server.listen(3001);
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = startStreamingServer;
function onStreamRequest(socket, dehydratedStream) {
    return __awaiter(this, void 0, void 0, function () {
        var opId, opStream;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Server got: " + dehydratedStream);
                    return [4 /*yield*/, index_1.ID_DIGEST(dehydratedStream)];
                case 1:
                    opId = _a.sent();
                    console.log("Rehydrating '" + opId + "'");
                    opStream = serialization_1.rehydrateOpStreamFromJson(dehydratedStream);
                    console.log("Rehydrated " + opId);
                    opStream.run(rxjs_1.NEVER, {}).pipe(operators_1.tap(function (v) {
                        console.log("Server tapped " + v);
                        socket.emit(opId, v);
                    })).subscribe();
                    return [2 /*return*/];
            }
        });
    });
}
