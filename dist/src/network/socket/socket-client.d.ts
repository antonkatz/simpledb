import { OperationStream } from "../../execution/OperationStream";
import { Observable } from "rxjs";
import { ConnectionContext } from "./ConnectionContext";
export declare type ExactOrVoid<T, R> = T extends void ? void : (T extends R ? (R extends T ? T : void) : void);
export default class NetworkStream {
    readonly host: string;
    readonly protocol: string;
    readonly port?: any;
    readonly path?: string | undefined;
    private socket;
    private socketio;
    constructor(host: string, protocol: string, port?: any, path?: string | undefined);
    connect(): Promise<void>;
    private openSocket;
    requestStream<Out, Ctx extends (void | ConnectionContext)>(opStream: OperationStream<void, Out, ExactOrVoid<Ctx, ConnectionContext>>): Observable<Out>;
}
//# sourceMappingURL=socket-client.d.ts.map