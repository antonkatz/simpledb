import { BasicOperation } from "../BasicOperation";
import { Observable } from "rxjs";
import { OperationStream } from "../..";
export declare class FilterEmpty<T> extends BasicOperation<T | null | undefined, T, void> {
    protected name: string;
    _operation(ctx: void, inObs: Observable<T | null | undefined>): Observable<T>;
    _security(ctx: void): boolean;
}
export declare class ApplyIfNotEmpty<T, R> extends BasicOperation<T | null | undefined, R | undefined, {
    op: OperationStream<T, R, void>;
}> {
    protected name: string;
    _operation(ctx: {
        op: OperationStream<T, R, void>;
    }, inObs: Observable<T | null | undefined>): Observable<R | undefined>;
    _security(ctx: {
        op: OperationStream<T, R, void>;
    }): boolean;
}
//# sourceMappingURL=filterOps.d.ts.map