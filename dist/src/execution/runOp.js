import { SecurityError } from "../Security";
export function runOp(op, additionalCtx, inObs) {
    if (op.security(additionalCtx)) {
        return op.operation(additionalCtx, inObs);
    }
    else {
        throw new SecurityError(`Security conditions failed in ${op.getOpName()} with ` +
            `additional context ${JSON.stringify(additionalCtx)}`);
    }
}
