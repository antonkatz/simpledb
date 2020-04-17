import { Observable } from "rxjs";
import { BasicOperation } from "../BasicOperation";
export declare class Once<In> extends BasicOperation<In, In | undefined, void> {
    protected name: string;
    _operation(ctx: void, inObs: Observable<In>): Observable<In | undefined>;
    _security(ctx: void): boolean;
}
//# sourceMappingURL=endOps.d.ts.map