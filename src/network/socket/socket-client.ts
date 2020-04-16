import {OperationStream}                               from "../../execution/OperationStream";
import {BehaviorSubject, fromEvent, NEVER, Observable} from "rxjs";
import {first, flatMap, tap}                           from "rxjs/operators";
import {ID_DIGEST}         from "../IdDigest";
import {ConnectionContext} from "./ConnectionContext";
import {isBrowser, isNode} from "browser-or-node";

export type ExactOrVoid<T, R> = T extends void ? void : (T extends R ? (R extends T ? T : void) : void)

export default class NetworkStream {
    private socket: BehaviorSubject<SocketIOClient.Socket | null> =
        new BehaviorSubject<SocketIOClient.Socket | null>(null);
    private socketio: SocketIOClientStatic | null = null;

    constructor(readonly host: string, readonly protocol: string, readonly port?: any, readonly path?: string) {
    }

    async connect() {
            console.debug('NetworkStream is connecting...');

            this.socketio = (await import('socket.io-client').then()).default;
            this.openSocket();

            const _t = this;
            window.addEventListener('beforeunload', function () {
                console.debug('Closing socket in `beforeunload`');
                _t.socket.toPromise().then(_ => _ && _.close());
            });
    }

    private openSocket() {
        const port = this.port ? `:${this.port}` : '';
        const url = `${this.protocol}//${this.host}${port}`;
        console.log(`NetworkStream opened socket on ${url} @ ${this.path}`);

        if (!this.socketio) throw new Error('Failed to load socketio client lib');

        const s = this.socketio(url, {transports: ['websocket'], path: this.path})
        this.socket.next(s)
    }

    requestStream<Out, Ctx extends (void | ConnectionContext)>(opStream: OperationStream<void, Out, ExactOrVoid<Ctx, ConnectionContext>>): Observable<Out> {
        // todo make sure to ack
        console.debug('Request to server is waiting to be subscribed');

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
                return (fromEvent(socket, opId) as Observable<Out>).pipe(
                    tap((resp) => console.debug('Response on ', opId))
                )
            })
        )
    }

}
