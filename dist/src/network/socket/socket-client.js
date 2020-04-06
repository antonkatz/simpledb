import { from, fromEvent, NEVER } from "rxjs";
import { ID_DIGEST, IS_BROWSER } from "../../index";
import { flatMap, filter } from "rxjs/operators";
export default class NetworkStream {
    constructor(host, protocol, port) {
        this.host = host;
        this.protocol = protocol;
        this.port = port;
        this.socket = Promise.resolve();
    }
    connect() {
        if (IS_BROWSER) {
            const url = `${this.protocol}//${this.host}:${this.port}`;
            this.socket = import('socket.io-client').then(({ default: io }) => io(url, { transports: ['websocket'] }));
        }
    }
    requestStream(opStream) {
        // todo make sure to ack
        console.debug('Request to server is waiting to be subscibed');
        if (!IS_BROWSER)
            return NEVER;
        return from(this.socket).pipe(filter(s => !!s), flatMap(_socket => {
            const dehydratedStream = opStream.serialize();
            const socket = _socket;
            return ID_DIGEST(dehydratedStream).then(opId => {
                console.debug('Reqested network stream has id:', opId);
                console.debug('Dehydrated stream:', dehydratedStream);
                return { opId, socket, dehydratedStream };
            });
        }), flatMap(({ opId, socket, dehydratedStream }) => {
            socket.emit('streamRequest', dehydratedStream);
            return fromEvent(socket, opId);
        }));
    }
}
