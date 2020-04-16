import { Observable } from "rxjs";
import { Operation } from "../operations/Operation";
export declare function runOp<In, Out, Context>(op: Operation<In, Out, Context>, additionalCtx: Context, inObs: Observable<In>): Observable<Out> | null;
//# sourceMappingURL=runOp.d.ts.map