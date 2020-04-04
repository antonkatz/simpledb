import { rehydrate } from "./index";
import { getRegisteredOperation } from "../operations/operationRegistry";
export function objToOp(raw) {
    if (raw.opName) {
        const op = getRegisteredOperation(raw.opName);
        if (op) {
            const ctx = raw.ctx && rehydrate(raw.ctx);
            return new op().withContext(ctx); // fixme get back an instance instead of a constructor
        }
        else {
            throw new Error(`Unregistered operation: '${raw.opName}'`);
        }
    }
    return undefined;
}
