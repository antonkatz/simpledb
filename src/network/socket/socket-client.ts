import {OperationStream} from "../../execution/OperationStream";
import {bindCallback, from, fromEvent, Observable, NEVER} from "rxjs";
import {ID_DIGEST, IS_BROWSER} from "../../index";
import {flatMap, filter} from "rxjs/operators";

export default class NetworkStream {
    private socket: Promise<SocketIOClient.Socket | void> = Promise.resolve();

    constructor(readonly host: string, readonly protocol: string, readonly port?: any, readonly path?: string) {
    }

    connect() {
        if (IS_BROWSER) {
            const port = this.port ? `:${this.port}` : ''
            const url = `${this.protocol}//${this.host}${port}`;
            console.log(`NetworkStream on ${this.path} ${port}`)
            this.socket = import('socket.io-client').then(({default: io}) =>
                io(url, {transports: ['websocket'], path: this.path})
            )
        }
    }

    requestStream<Out>(opStream: OperationStream<void, Out, never>): Observable<Out> {
        // todo make sure to ack
        console.debug('Request to server is waiting to be subscibed')

        if (!IS_BROWSER) return NEVER

        return from(this.socket).pipe(
            filter(s => !!s),
            flatMap(_socket => {
                const dehydratedStream = opStream.serialize();
                const socket = _socket as SocketIOClient.Socket
                return ID_DIGEST(dehydratedStream).then(opId => {
                    console.debug('Reqested network stream has id:', opId)
                    console.debug('Dehydrated stream:', dehydratedStream)
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
