import { Observable } from "rxjs";
import { OperationStream } from "../execution/OperationStream";
export declare const OperationSymbol: unique symbol;
export declare type OrEmpty<T> = T extends never ? {} : T;
export declare type OrVoid<T> = T extends never ? void : T;
export interface Operation<In, Out, Context> {
    readonly symbol: Symbol;
    operation: (ctx: Context, inObs: Observable<In>) => Observable<Out>;
    security: (ctx: Context) => boolean;
    getOpName(): string;
    withContext<PCtx extends Partial<Context>>(andContext: PCtx): BasicOperation<In, Out, Omit<Context, keyof PCtx>>;
    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, OrEmpty<NextCtx> & OrEmpty<Context>>;
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>): OperationStream<In, NextOut, OrEmpty<NextCtx> & OrEmpty<Context>>;
    toJSON(): {
        opName: string;
        ctx: any;
    };
}
export declare abstract class BasicOperation<In, Out, Context> implements Operation<In, Out, Context> {
    readonly symbol: symbol;
    protected context: any;
    protected abstract name: string;
    abstract _security(ctx: Context): boolean;
    abstract _operation(ctx: Context, inObs: Observable<In>): Observable<Out>;
    getOpName(): string;
    withContext<PCtx extends Partial<Context>, NextCtx extends Omit<Context, keyof PCtx>>(andContext: PCtx): BasicOperation<In, Out, NextCtx>;
    operation(ctx: Context, inObs: Observable<In>): Observable<Out>;
    security(ctx: Context): boolean;
    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, OrEmpty<NextCtx> & OrEmpty<Context>>;
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>): OperationStream<In, NextOut, OrEmpty<NextCtx> & OrEmpty<Context>>;
    toJSON(): {
        opName: string;
        ctx: any;
    };
}
//# sourceMappingURL=Operation.d.ts.map