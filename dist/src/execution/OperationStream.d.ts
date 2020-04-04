import { List } from "immutable";
import { Operation, OrEmpty } from "../operations/Operation";
import { Observable } from "rxjs";
export declare const OperationStreamSymbol: unique symbol;
export declare type SerializedOperationStream = {
    ctx?: any;
    chain: any[];
};
export interface OperationStream<In, Out, Context> {
    readonly symbol: Symbol;
    readonly chain: List<Operation<any, any, any>>;
    defaultContext?: Partial<Context>;
    setContext(ctx: Context): OperationStream<In, Out, {}>;
    run(input: Observable<In>, ctx: Context): Observable<Out>;
    add<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, NextCtx>;
    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>): OperationStream<In, NextOut, OtherCtx & Context>;
    serialize(): string;
}
export declare class BasicOperationStream<In, Out, Context> implements OperationStream<In, Out, Context> {
    readonly chain: List<Operation<any, any, any>>;
    readonly symbol: symbol;
    defaultContext: any;
    constructor(chain?: List<Operation<any, any, any>>, _defaultContext?: Partial<Context>);
    setContext(ctx: Context): OperationStream<In, Out, {}>;
    run(input: Observable<In>, ctx?: Partial<Context>): Observable<Out>;
    securityCheck(ctx: Partial<Context>): void;
    add<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, Partial<NextCtx & Context>>;
    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>): OperationStream<In, NextOut, OtherCtx & Context>;
    serialize(): string;
}
export declare function buildOpStream<In, Out, Context>(op: Operation<In, Out, Context>): OperationStream<In, Out, Context>;
export declare function buildOpStream<In, Out, Context, DCtx extends Partial<Context>>(op: Operation<In, Out, Context>, defaultContext: DCtx): OperationStream<In, Out, OrEmpty<Omit<Context, keyof DCtx>>>;
//# sourceMappingURL=OperationStream.d.ts.map