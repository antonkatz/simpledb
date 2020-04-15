import { BasicOperationStream, SerializedOperationStream } from "../execution/OperationStream";
export declare function rehydrateOpStreamFromJson(json: string): BasicOperationStream<unknown, unknown, unknown>;
export declare function rehydrateOpStream(dehydratedOpStream: SerializedOperationStream): BasicOperationStream<unknown, unknown, unknown>;
export declare function rehydrate(raw: any): any;
//# sourceMappingURL=index.d.ts.map