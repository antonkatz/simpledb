import { rehydrateOpStreamFromJson } from "../../serialization";
import { NEVER } from "rxjs";
import { tap } from "rxjs/operators";
import { ID_DIGEST } from "../../index";
import { subscribeWithTracking, unsubscribleAll } from "./tracking";
export default async function startStreamingServer() {
    console.log('Starting streaming server');
    const express = await import("express").then(i => i.default);
    const http = await import("http").then(i => i.default);
    const socketio = await import('socket.io').then(i => i.default);
    // @ts-ignore
    const cors = await import('cors').then(i => i.default);
    const app = express();
    app.use(cors({
        origin: true
    }));
    const server = http.createServer(app);
    const io = socketio(server, { serveClient: false, transports: ['websocket'] });
    io.on('connection', (socket) => {
        console.log('user connected');
        const osr = (ds) => onStreamRequest(socket, ds);
        socket.on('streamRequest', osr);
        socket.on('disconnect', () => unsubscribleAll(socket.id));
    });
    server.listen(3001);
}
async function onStreamRequest(socket, dehydratedStream) {
    console.log(`Server got: ${dehydratedStream}`);
    const opId = await ID_DIGEST(dehydratedStream);
    console.log(`Rehydrating '${opId}'`);
    const opStream = rehydrateOpStreamFromJson(dehydratedStream);
    console.log(`Rehydrated ${opId}`);
    const obs = opStream.run(NEVER, {}).pipe(tap(v => {
        console.log(`Server tapped ${JSON.stringify(v)}`);
        socket.emit(opId, v);
    }));
    subscribeWithTracking(socket.id, opId, obs);
}
