import {getRegisteredOperation}                from "../operations/operationRegistry"
import {OmitIntoVoid, Operation}               from "../operations/Operation"
import {List}                                  from "immutable";
import {BasicOperationStream, OperationStream} from "..";
import {rehydrate}                             from "./rehydrate";

export function objToStream(raw: any): OperationStream<any, any, any | void> | undefined {
    if (raw.__type === 'basicOperationStream') {
        if (Array.isArray(raw.chain)) {
            const chain = List(raw.chain.map(rehydrate))
            const ctx = rehydrate(raw.ctx || {})

            return new BasicOperationStream(chain as List<Operation<any, any, any>>, ctx)
        }
        throw new Error('Stream must be represented as array')
    }

    return undefined
}
