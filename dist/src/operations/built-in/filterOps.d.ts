import { BasicOperation } from "../BasicOperation";
import { Observable } from "rxjs";
export declare class FilterEmpty<T> extends BasicOperation<T | null | undefined, T, void> {
    protected name: string;
    _operation(ctx: void, inObs: Observable<T | null | undefined>): Observable<T>;
    _security(ctx: void): boolean;
}
//# sourceMappingURL=filterOps.d.ts.map