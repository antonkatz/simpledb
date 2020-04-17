import {getRegisteredOperation}                from "../operations/operationRegistry"
import {OmitIntoVoid, Operation}               from "../operations/Operation"
import {List}                                  from "immutable";
import {BasicOperationStream, OperationStream} from "..";
import {rehydrate}                             from "./rehydrate";
import * as rxjsOperators                           from 'rxjs/operators'
import {RxjsContext}                           from "../operations/built-in/rxjsOps/RxjsPipable";

export function objToRxjsContext(raw: any): RxjsContext<any, any, any> | undefined {
    if (raw.__type === 'RxjsContext') {
        if (raw.op) {
            // @ts-ignore
            const op: any = rxjsOperators[raw.op as string]
            const args = rehydrate(raw.args || [])

            return {op, args}
        }
        throw new Error('Operation name should be an rxjs operation')
    }

    return undefined
}
