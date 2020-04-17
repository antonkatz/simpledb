import { BasicOperation } from "../BasicOperation";
import { BasicOperationStream, OperationStream } from "../..";
import { Observable } from "rxjs";
export declare class ReplaceIfEmpty<T, R, Ctx> extends BasicOperation<T | null | undefined, R | T, {
    replaceWith: OperationStream<void, R, Ctx>;
} & Ctx> {
    protected name: string;
    _operation(ctx: {
        replaceWith: BasicOperationStream<void, R, Ctx>;
    } & Ctx, inObs: Observable<T>): Observable<R | T>;
    _security(ctx: {
        replaceWith: BasicOperationStream<void, R, Ctx>;
    } & Ctx): boolean;
}
//# sourceMappingURL=mapOps.d.ts.map