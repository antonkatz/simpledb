import { List } from "immutable";
import { Operation, OrEmpty, VoidIfEmpty } from "../operations/Operation";
import { Observable } from "rxjs";
export declare const OperationStreamSymbol: unique symbol;
export declare type SerializedOperationStream = {
    ctx?: any;
    chain: any[];
};
export interface OperationStream<In, Out, Context> {
    readonly symbol: Symbol;
    readonly chain: List<Operation<any, any, any>>;
    getContext(): any;
    setContext(ctx: Context): OperationStream<In, Out, void>;
    withContext<PCtx extends Partial<Context>>(ctx: PCtx): OperationStream<In, Out, Omit<Context, keyof PCtx>>;
    run(input: Observable<In>, ctx: Context): Observable<Out>;
    add<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>;
    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<OtherCtx> & OrEmpty<Context>>>;
    serialize(): string;
}
export declare class BasicOperationStream<In, Out, Context> implements OperationStream<In, Out, Context> {
    readonly chain: List<Operation<any, any, any>>;
    readonly symbol: symbol;
    innerContext: any;
    constructor(chain?: List<Operation<any, any, any>>, _defaultContext?: {});
    getContext(): any;
    setContext(ctx: Context): OperationStream<In, Out, void>;
    withContext<PCtx extends Partial<Context>>(ctx: PCtx): OperationStream<In, Out, Omit<Context, keyof PCtx>>;
    run(input: Observable<In>, ctx?: Partial<Context>): Observable<Out>;
    securityCheck(ctx: Partial<Context>): void;
    add<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>;
    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<OtherCtx> & OrEmpty<Context>>>;
    serialize(): string;
}
export declare function buildOpStream<In, Out, Context>(op: Operation<In, Out, Context>): OperationStream<In, Out, Context>;
export declare function buildOpStream<In, Out, Context, DCtx extends Partial<Context>>(op: Operation<In, Out, Context>, defaultContext: DCtx): OperationStream<In, Out, OrEmpty<Omit<Context, keyof DCtx>>>;
//# sourceMappingURL=OperationStream.d.ts.map