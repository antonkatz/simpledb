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
const tracking_1 = require("./tracking");
const IdDigest_1 = require("../IdDigest");
const monet_1 = require("monet");
async function startStreamingServer(key, cert, eventListeners) {
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
    const onDisconnect$ = monet_1.Maybe.fromNull(eventListeners).flatMap(_ => monet_1.Maybe.fromNull(_.onDisconnect));
    io.on('connection', (socket) => {
        console.debug(`User connected: ${socket.id}`);
        const osr = (ds) => onStreamRequest(socket, ds);
        socket.on('streamRequest', osr);
        socket.on('disconnect', () => {
            tracking_1.unsubscribleAll(socket.id);
            onDisconnect$.forEach(_ => _(socket));
        });
    });
    server.listen(3001);
}
exports.default = startStreamingServer;
async function onStreamRequest(socket, dehydratedStream) {
    // console.debug(`Server got dehydrated: ${dehydratedStream}`)
    const opId = await IdDigest_1.ID_DIGEST(dehydratedStream);
    const opStream = serialization_1.rehydrateOpStreamFromJson(dehydratedStream);
    const connCtx = createConnectionContext(opId, socket.id);
    const obs = opStream.run(rxjs_1.NEVER, connCtx).pipe(operators_1.tap(v => {
        // console.debug(`Server tapped: ${JSON.stringify(v)}`)
        console.debug(`Responded to '${socket.id}' -- '${opId}'`);
        socket.emit(opId, v);
    }));
    tracking_1.subscribeWithTracking(socket.id, opId, obs);
}
function createConnectionContext(opId, socketId) {
    return {
        _connection: {
            socketId,
            opId
        }
    };
}
