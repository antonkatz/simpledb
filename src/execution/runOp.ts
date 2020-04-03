import {Observable} from "rxjs"
import {Operation} from "../operations/Operation"
import {SecurityError} from "../Security"

export function runOp<In, Out, Context>(op: Operation<In, Out, Context>, additionalCtx: Context, inObs: Observable<In>):
    Observable<Out> | null {
    if (op.security(additionalCtx)) {
        return op.operation(additionalCtx, inObs)
    } else {
        throw new SecurityError(`Security conditions failed in ${op.getOpName()} with ` +
            `additional context ${JSON.stringify(additionalCtx)}`)
    }
}