import { Observable } from "rxjs";
import { OperationStream } from "../execution/OperationStream";
export declare const OperationSymbol: unique symbol;
export declare type OrEmpty<T> = T extends never ? {} : T;
export interface Operation<In, Out, Context> {
    readonly symbol: Symbol;
    readonly operation: (ctx: Context, inObs: Observable<In>) => Observable<Out>;
    readonly security: (ctx: Context) => boolean;
    getOpName(): string;
    withContext<PCtx extends Partial<Context>, NextCtx extends OrEmpty<Omit<Context, keyof PCtx>>>(andContext: PCtx): BasicOperation<In, Out, NextCtx>;
    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, NextCtx & Context>;
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>): OperationStream<In, NextOut, NextCtx & Context>;
    toJSON(): {
        opName: string;
        ctx: Partial<Context>;
    };
}
export declare abstract class BasicOperation<In, Out, Context> implements Operation<In, Out, Context> {
    readonly symbol: symbol;
    context: {};
    protected abstract name: string;
    abstract security(ctx: Context): boolean;
    abstract operation(ctx: Context, inObs: Observable<In>): Observable<Out>;
    getOpName(): string;
    withContext<PCtx extends Partial<Context>, NextCtx extends OrEmpty<Omit<Context, keyof PCtx>>>(andContext: PCtx): BasicOperation<In, Out, NextCtx>;
    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, NextCtx & Context>;
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>): OperationStream<In, NextOut, NextCtx & Context>;
    toJSON(): {
        opName: string;
        ctx: {};
    };
}
//# sourceMappingURL=Operation.d.ts.map