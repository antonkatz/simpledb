import {OperationStream} from "../../execution/OperationStream";
import {bindCallback, from, fromEvent, Observable} from "rxjs";
import {ID_DIGEST, IS_BROWSER} from "../../index";
import {flatMap, filter} from "rxjs/operators";

export default class NetworkStream {
    private socket: Promise<SocketIOClient.Socket | void> = Promise.resolve();

    constructor(readonly host: string) {
    }

    connect() {
        if (IS_BROWSER) {
            const url = `http://${this.host}:3001`;
            this.socket = import('socket.io-client').then(({default: io}) =>
                io(url, {transports: ['websocket']})
            )
        }
    }

    requestStream<Out>(opStream: OperationStream<void, Out, {}>): Observable<Out> {
        // todo make sure to ack
        console.log('Attempting to request a stream from server')

        return from(this.socket).pipe(
            filter(s => !!s),
            flatMap(_socket => {
                const dehydratedStream = opStream.serialize();
                const socket = _socket as SocketIOClient.Socket
                return ID_DIGEST(dehydratedStream).then(opId => {
                    console.log('Reqested network stream has id', opId)
                    console.log('Stream', dehydratedStream)
                    return {opId, socket, dehydratedStream}
                })
            }),
            flatMap(({opId, socket, dehydratedStream}) => {
                console.log(`Client expects reply on ${opId}`)

                socket.emit('streamRequest', dehydratedStream);

                return fromEvent(socket, opId) as Observable<Out>
            })
        )


    }

}
