import {rehydrateOpStreamFromJson} from "../../serialization";
import {NEVER} from "rxjs";
import crypto from 'crypto'
import {tap} from "rxjs/operators";
import {ID_DIGEST} from "../../index";
import {subscribeWithTracking, unsubscribleAll} from "./tracking";


export default async function startStreamingServer(key: Buffer, cert: Buffer) {
    console.log('Starting streaming server');

    const express = await import("express").then(i => i.default);
    const https = await import("https").then(i => i.default);
    const socketio = await import('socket.io').then(i => i.default)
    // @ts-ignore
    const cors = await import('cors').then(i => i.default)
    // const fs = await import('fs').then(i => i.default)

    const app = express();
    app.use(cors(
        {
            origin: true
        }
    ))

    const server = https.createServer({
            key,
            cert
        }, app);

    const io = socketio(server, {serveClient: false, transports: ['websocket']})

    io.on('connection', (socket: any) => {
        console.debug(`User connected: ${socket.id}`);

        const osr = (ds: string) => onStreamRequest(socket, ds)
        socket.on('streamRequest', osr)

        socket.on('disconnect', () => unsubscribleAll(socket.id))
    })

    server.listen(3001)
}

async function onStreamRequest(socket: any, dehydratedStream: string) {
    // console.debug(`Server got dehydrated: ${dehydratedStream}`)

    const opId = await ID_DIGEST(dehydratedStream)
    const opStream = rehydrateOpStreamFromJson(dehydratedStream);

    const obs = opStream.run(NEVER, {}).pipe(
        tap(v => {
            // console.debug(`Server tapped: ${JSON.stringify(v)}`)
            console.debug(`Responded to '${socket.id}' -- '${opId}'`)
            socket.emit(opId, v)
        })
    )

    subscribeWithTracking(socket.id, opId, obs)
}
