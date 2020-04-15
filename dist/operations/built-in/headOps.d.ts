import { Observable } from "rxjs";
import { BasicOperation } from "../BasicOperation";
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