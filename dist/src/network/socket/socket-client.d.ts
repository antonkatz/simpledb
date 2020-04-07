import { OperationStream } from "../../execution/OperationStream";
import { Observable } from "rxjs";
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
    requestStream<Out>(opStream: OperationStream<void, Out, never>): Observable<Out>;
}
//# sourceMappingURL=socket-client.d.ts.map