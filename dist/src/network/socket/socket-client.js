"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var index_1 = require("../../index");
var operators_1 = require("rxjs/operators");
var NetworkStream = /** @class */ (function () {
    function NetworkStream(host) {
        this.host = host;
        this.socket = Promise.resolve();
    }
    NetworkStream.prototype.connect = function () {
        if (index_1.IS_BROWSER) {
            var url_1 = "http://" + this.host + ":3001";
            this.socket = Promise.resolve().then(function () { return __importStar(require('socket.io-client')); }).then(function (_a) {
                var io = _a.default;
                return io(url_1);
            });
        }
    };
    NetworkStream.prototype.requestStream = function (opStream) {
        // todo make sure to ack
        console.log('Attempting to request a stream from server');
        return rxjs_1.from(this.socket).pipe(operators_1.filter(function (s) { return !!s; }), operators_1.flatMap(function (_socket) {
            var dehydratedStream = opStream.serialize();
            var socket = _socket;
            return index_1.ID_DIGEST(dehydratedStream).then(function (opId) {
                console.log('Reqested network stream has id', opId);
                console.log('Stream', dehydratedStream);
                return { opId: opId, socket: socket, dehydratedStream: dehydratedStream };
            });
        }), operators_1.flatMap(function (_a) {
            var opId = _a.opId, socket = _a.socket, dehydratedStream = _a.dehydratedStream;
            console.log("Client expects reply on " + opId);
            socket.emit('streamRequest', dehydratedStream);
            return rxjs_1.fromEvent(socket, opId);
        }));
    };
    return NetworkStream;
}());
exports.default = NetworkStream;
