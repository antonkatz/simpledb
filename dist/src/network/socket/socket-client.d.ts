import { OperationStream } from "../../execution/OperationStream";
import { Observable } from "rxjs";
export default class NetworkStream {
    readonly host: string;
    readonly protocol: string;
    readonly port: number;
    private socket;
    constructor(host: string, protocol: string, port: number);
    connect(): void;
    requestStream<Out>(opStream: OperationStream<void, Out, never>): Observable<Out>;
}
//# sourceMappingURL=socket-client.d.ts.map