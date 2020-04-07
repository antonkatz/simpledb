import { BehaviorSubject, fromEvent, NEVER } from "rxjs";
import { ID_DIGEST, IS_BROWSER } from "../../index";
import { first, flatMap } from "rxjs/operators";
export default class NetworkStream {
    constructor(host, protocol, port, path) {
        this.host = host;
        this.protocol = protocol;
        this.port = port;
        this.path = path;
        this.socket = new BehaviorSubject(null);
        this.socketio = null;
    }
    async connect() {
        if (IS_BROWSER) {
            console.debug('NetworkStream is connecting...');
            this.socketio = (await import('socket.io-client').then()).default;
            this.openSocket();
            const _t = this;
            window.addEventListener('beforeunload', function () {
                console.debug('Closing socket in `beforeunload`');
                _t.socket.toPromise().then(_ => _.close());
            });
        }
    }
    openSocket() {
        const port = this.port ? `:${this.port}` : '';
        const url = `${this.protocol}//${this.host}${port}`;
        console.log(`NetworkStream opened socket on ${url} @ ${this.path}`);
        if (!this.socketio)
            throw new Error('Failed to load socketio client lib');
        this.socket.next(this.socketio(url, { transports: ['websocket'], path: this.path }));
    }
    requestStream(opStream) {
        // todo make sure to ack
        console.debug('Request to server is waiting to be subscribed');
        if (!IS_BROWSER)
            return NEVER;
        return this.socket.pipe(first(s => {
            console.debug('NetworkStream attempting to use socket', s);
            return !!s;
        }), flatMap(_socket => {
            console.debug('.');
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
