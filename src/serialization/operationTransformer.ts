import {rehydrate} from "./index"
import {getRegisteredOperation} from "../operations/operationRegistry"
import {Operation} from "../operations/Operation"

export function objToOp(raw: any): Operation<any, any, any> | undefined {
    if (raw.opName) {
        const op = getRegisteredOperation(raw.opName)
        if (op) {
            const ctx = raw.ctx && rehydrate(raw.ctx)
            return new op().withContext(ctx)
        } else {
            throw new Error('Unregistered operation')
        }
    }

    return undefined
}
