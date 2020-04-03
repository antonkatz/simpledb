import {rehydrateOpStreamFromJson} from "../../serialization";
import {NEVER} from "rxjs";
import crypto from 'crypto'
import {tap} from "rxjs/operators";
import {ID_DIGEST} from "../../index";


export default async function startStreamingServer() {
    console.log('Starting streaming server');

    const express = await import("express").then(i => i.default);
    const http = await import("http").then(i => i.default);
    const socketio = await import('socket.io').then(i => i.default)
    // @ts-ignore
    const cors = await import('cors').then(i => i.default)

    const app = express();
    app.use(cors)

    const server = http.createServer(app);

    const io = socketio(server, {serveClient: false})

    io.on('connection', (socket: any) => {
        console.log('user connected');

        const osr = (ds: string) => onStreamRequest(socket, ds)
        socket.on('streamRequest', osr)
    })

    server.listen(3001)
}

async function onStreamRequest(socket: any, dehydratedStream: string) {
    console.log(`Server got: ${dehydratedStream}`)

    const opId = await ID_DIGEST(dehydratedStream)
    console.log(`Rehydrating '${opId}'`);

    const opStream = rehydrateOpStreamFromJson(dehydratedStream);

    console.log(`Rehydrated ${opId}`);

    opStream.run(NEVER, {}).pipe(
        tap(v => {
            console.log(`Server tapped ${v}`)
            socket.emit(opId, v)
        })
    ).subscribe()
}
