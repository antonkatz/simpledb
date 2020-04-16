import { Operation } from "./Operation";
import { BasicOperation } from "./BasicOperation";
export declare function getRegisteredOperation(opName: string): (new () => Operation<any, any, any>) | undefined;
export declare function registerOperation<In, Out, Ctx, Op extends BasicOperation<In, Out, Ctx>>(op: new () => Op): Op;
//# sourceMappingURL=operationRegistry.d.ts.map