import { BasicOperation } from "./Operation";
import { Observable } from "rxjs";
export declare class HeadOp<V> extends BasicOperation<void, V, {
    head: V;
}> {
    protected name: string;
    _security(ctx: {
        head: V;
    }): boolean;
    _operation(ctx: {
        head: V;
    }): Observable<V>;
}
//# sourceMappingURL=headOps.d.ts.map