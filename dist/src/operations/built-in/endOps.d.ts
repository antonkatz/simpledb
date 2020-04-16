import { Observable } from "rxjs";
import { BasicOperation } from "../BasicOperation";
export declare class Once<In> extends BasicOperation<In, In, never> {
    protected name: string;
    _operation(ctx: never, inObs: Observable<In>): Observable<In>;
    _security(ctx: never): boolean;
}
//# sourceMappingURL=endOps.d.ts.map