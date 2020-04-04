import { from, fromEvent, NEVER } from "rxjs";
import { ID_DIGEST, IS_BROWSER } from "../../index";
import { flatMap, filter } from "rxjs/operators";
export default class NetworkStream {
    constructor(host) {
        this.host = host;
        this.socket = Promise.resolve();
    }
    connect() {
        if (IS_BROWSER) {
            const url = `http://${this.host}:3001`;
            this.socket = import('socket.io-client').then(({ default: io }) => io(url, { transports: ['websocket'] }));
        }
    }
    requestStream(opStream) {
        // todo make sure to ack
        console.log('Request to server is waiting to be subscibed');
        if (!IS_BROWSER)
            return NEVER;
        return from(this.socket).pipe(filter(s => !!s), flatMap(_socket => {
            const dehydratedStream = opStream.serialize();
            const socket = _socket;
            return ID_DIGEST(dehydratedStream).then(opId => {
                console.log('Reqested network stream has id', opId);
                console.log('Stream', dehydratedStream);
                return { opId, socket, dehydratedStream };
            });
        }), flatMap(({ opId, socket, dehydratedStream }) => {
            console.log(`Client expects reply on ${opId}`);
            socket.emit('streamRequest', dehydratedStream);
            return fromEvent(socket, opId);
        }));
    }
}
