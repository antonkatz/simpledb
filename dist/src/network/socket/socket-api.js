"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialization_1 = require("../../serialization");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const index_1 = require("../../index");
const tracking_1 = require("./tracking");
async function startStreamingServer(key, cert) {
    console.log('Starting streaming server');
    const express = await Promise.resolve().then(() => __importStar(require("express"))).then(i => i.default);
    const https = await Promise.resolve().then(() => __importStar(require("https"))).then(i => i.default);
    const socketio = await Promise.resolve().then(() => __importStar(require('socket.io'))).then(i => i.default);
    // @ts-ignore
    const cors = await Promise.resolve().then(() => __importStar(require('cors'))).then(i => i.default);
    // const fs = await import('fs').then(i => i.default)
    const app = express();
    app.use(cors({
        origin: true
    }));
    const server = https.createServer({
        key,
        cert
    }, app);
    const io = socketio(server, { serveClient: false, transports: ['websocket'] });
    io.on('connection', (socket) => {
        console.debug(`User connected: ${socket.id}`);
        const osr = (ds) => onStreamRequest(socket, ds);
        socket.on('streamRequest', osr);
        socket.on('disconnect', () => tracking_1.unsubscribleAll(socket.id));
    });
    server.listen(3001);
}
exports.default = startStreamingServer;
async function onStreamRequest(socket, dehydratedStream) {
    console.debug(`Server got dehydrated: ${dehydratedStream}`);
    const opId = await index_1.ID_DIGEST(dehydratedStream);
    const opStream = serialization_1.rehydrateOpStreamFromJson(dehydratedStream);
    const obs = opStream.run(rxjs_1.NEVER, {}).pipe(operators_1.tap(v => {
        console.debug(`Server tapped: ${JSON.stringify(v)}`);
        socket.emit(opId, v);
    }));
    tracking_1.subscribeWithTracking(socket.id, opId, obs);
}
