import {getRegisteredOperation}  from "../operations/operationRegistry"
import {OmitIntoVoid, Operation} from "../operations/Operation"
import {rehydrate}               from "./rehydrate";

export function objToOp(raw: any): Operation<any, any, any | void> | undefined {
    if (raw.opName) {
        const op: (new () => Operation<any, any, any>) | undefined = getRegisteredOperation(raw.opName)
        if (op) {
            const ctx: any | undefined = raw.ctx && rehydrate(raw.ctx)
            if (ctx) {
                return new op().withContext(ctx) // fixme get back an instance instead of a constructor
            } else {
                return new op()
            }
        } else {
            throw new Error(`Unregistered operation: '${raw.opName}'`)
        }
    }

    return undefined
}
