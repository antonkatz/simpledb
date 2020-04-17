import { Observable } from "rxjs";
import { Operation, OperationStream, OrEmpty } from "..";
import { OmitIntoVoid, VoidIfEmpty } from "./Operation";
export declare abstract class BasicOperation<In, Out, Context> implements Operation<In, Out, Context> {
    readonly symbol: symbol;
    protected context: any;
    protected abstract name: string;
    abstract _security(ctx: Context): boolean;
    abstract _operation(ctx: Context, inObs: Observable<In>): Observable<Out>;
    getOpName(): string;
    withContext<PCtx extends Partial<Context>, NextCtx extends OmitIntoVoid<Context, keyof PCtx>>(andContext: PCtx): BasicOperation<In, Out, NextCtx>;
    operation(ctx: Context, inObs: Observable<In>): Observable<Out>;
    security(ctx: Context): boolean;
    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>;
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>;
    toJSON(): {
        opName: string;
        ctx: any;
    };
}
//# sourceMappingURL=BasicOperation.d.ts.map