import {rehydrateOpStreamFromJson}              from "../../serialization";
import {NEVER}                                  from "rxjs";
import {tap}                                    from "rxjs/operators";
import {subscribeWithTracking, unsubscribleAll} from "./tracking";
import {ID_DIGEST}                              from "../IdDigest";
import {ConnectionContext}                      from "./ConnectionContext";
import {Socket}                                 from "socket.io";
import {Maybe}                                  from "monet";

import {enablePatches} from "immer";
enablePatches()

export default async function startStreamingServer(key: Buffer, cert: Buffer,
                                                   eventListeners?: {
                                                       onDisconnect?: (socketId: string) => void
                                                   }) {
    console.log('Starting streaming server');

    const express = await import("express").then(i => i.default);
    const https = await import("https").then(i => i.default);
    const socketio = await import('socket.io').then(i => i.default);
    // @ts-ignore
    const cors = await import('cors').then(i => i.default);
    // const fs = await import('fs').then(i => i.default)

    const app = express();
    app.use(cors(
        {
            origin: true
        }
    ));

    const server = https.createServer({
        key,
        cert
    }, app);

    const io = socketio(server, {serveClient: false, transports: ['websocket']});

    const onDisconnect$ =  Maybe.fromNull(eventListeners).flatMap(_ => Maybe.fromNull(_.onDisconnect))

    io.on('connection', (socket: any) => {
        console.debug(`User connected: ${socket.id}`);

        const osr = (ds: string) => onStreamRequest(socket, ds);
        socket.on('streamRequest', osr);

        socket.on('disconnect', () => {
            unsubscribleAll(socket.id)
            onDisconnect$.forEach(_ => _(socket.id))
        })
    });

    server.listen(3001)
}

async function onStreamRequest(socket: Socket, dehydratedStream: string) {
    // console.debug(`Server got dehydrated: ${dehydratedStream}`)

    const opStream = rehydrateOpStreamFromJson(dehydratedStream);
    if (!opStream) throw new TypeError('Operation stream failed to rehydrate')
    const opId = await ID_DIGEST(dehydratedStream);

    const connCtx = createConnectionContext(opId, socket.id);
    const obs = opStream.run(NEVER, connCtx).pipe(
        tap(v => {
            // console.debug(`Server tapped: ${JSON.stringify(v)}`)
            console.debug(`Responded to '${socket.id}' -- '${opId}'`);
            socket.emit(opId, v)
        })
    );

    subscribeWithTracking(socket.id, opId, obs)
}

function createConnectionContext(opId: string, socketId: string): ConnectionContext {
    return {
        _connection: {
            socketId,
            opId
        }
    }
}
