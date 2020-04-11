import {OperationStream} from "../../execution/OperationStream";
import {BehaviorSubject, fromEvent, NEVER, Observable} from "rxjs";
import {ID_DIGEST, IS_BROWSER} from "../../index";
import {first, flatMap} from "rxjs/operators";

export default class NetworkStream {
    private socket: BehaviorSubject<SocketIOClient.Socket | null> =
        new BehaviorSubject<SocketIOClient.Socket | null>(null);
    private socketio: SocketIOClientStatic | null = null;

    constructor(readonly host: string, readonly protocol: string, readonly port?: any, readonly path?: string) {
    }

    async connect() {
        if (IS_BROWSER) {

            console.debug('NetworkStream is connecting...');

            this.socketio = (await import('socket.io-client').then()).default;
            this.openSocket();

            const _t = this;
            window.addEventListener('beforeunload', function () {
                console.debug('Closing socket in `beforeunload`');
                _t.socket.toPromise().then(_ => _ && _.close());
            });
        }
    }

    private openSocket() {
        const port = this.port ? `:${this.port}` : '';
        const url = `${this.protocol}//${this.host}${port}`;
        console.log(`NetworkStream opened socket on ${url} @ ${this.path}`);

        if (!this.socketio) throw new Error('Failed to load socketio client lib');

        const s = this.socketio(url, {transports: ['websocket'], path: this.path})
        this.socket.next(s)
    }

    requestStream<Out>(opStream: OperationStream<void, Out, never>): Observable<Out> {
        // todo make sure to ack
        console.debug('Request to server is waiting to be subscribed');

        if (!IS_BROWSER) return NEVER;

        return this.socket.pipe(
            first(s => {
                console.debug('NetworkStream attempting to use socket', s && s.id);
                return !!s
            }),
            flatMap(_socket => {
                console.debug('.');
                const dehydratedStream = opStream.serialize();
                const socket = _socket as SocketIOClient.Socket;
                return ID_DIGEST(dehydratedStream).then(opId => {
                    console.debug('Reqested network stream has id:', opId);
                    console.debug('Dehydrated stream:', dehydratedStream);
                    return {opId, socket, dehydratedStream}
                })
            }),
            flatMap(({opId, socket, dehydratedStream}) => {
                socket.emit('streamRequest', dehydratedStream);
                return fromEvent(socket, opId) as Observable<Out>
            })
        )


    }

}
