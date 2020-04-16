import { Observable } from "rxjs";
import { OperationStream } from "../execution/OperationStream";
import { BasicOperation } from "./BasicOperation";
export declare const OperationSymbol: unique symbol;
export declare type OrEmpty<T> = T extends never ? {} : T;
export declare type VoidIfEmpty<T> = {} extends T ? void : T;
export interface Operation<In, Out, Context> {
    readonly symbol: Symbol;
    operation: (ctx: Context, inObs: Observable<In>) => Observable<Out>;
    security: (ctx: Context) => boolean;
    getOpName(): string;
    withContext<PCtx extends Partial<Context>>(andContext: PCtx): BasicOperation<In, Out, Omit<Context, keyof PCtx>>;
    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>;
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>;
    toJSON(): {
        opName: string;
        ctx: any;
    };
}
//# sourceMappingURL=Operation.d.ts.map