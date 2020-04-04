import { BasicOperation, Operation } from "./Operation";
export declare function getRegisteredOperation(opName: string): (new () => Operation<any, any, any>) | undefined;
export declare function registerOperation(op: new () => BasicOperation<any, any, any>): void;
//# sourceMappingURL=operationRegistry.d.ts.map