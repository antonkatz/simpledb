import { OperationStream } from "../../execution/OperationStream";
import { Observable } from "rxjs";
export default class NetworkStream {
    readonly host: string;
    private socket;
    constructor(host: string);
    connect(): void;
    requestStream<Out>(opStream: OperationStream<void, Out, never>): Observable<Out>;
}
//# sourceMappingURL=socket-client.d.ts.map