import {Observable}                                                from "rxjs";
import {BasicOperationStream, Operation, OperationStream, OrEmpty} from "..";
import {List}                                                      from "immutable";
import {OperationStreamSymbol}                                     from "../execution/OperationStream";
import {OperationSymbol}                                           from "./Operation";

export abstract class BasicOperation<In, Out, Context> implements Operation<In, Out, Context> {
    readonly symbol = OperationSymbol;

    protected context: any = {};
    protected abstract name: string;

    abstract _security(ctx: Context): boolean

    abstract _operation(ctx: Context, inObs: Observable<In>): Observable<Out>

    getOpName() {
        return this.name
    }

    withContext<PCtx extends Partial<Context>, NextCtx extends Omit<Context, keyof PCtx>>(andContext: PCtx):
        BasicOperation<In, Out, NextCtx> {
        const _s = this;
        const oldContext = this.context

        return new class extends BasicOperation<In, Out, NextCtx> {
            name = _s.getOpName();
            context = {...oldContext, ...andContext}

            _security(ctx: NextCtx): boolean {
                // @ts-ignore
                return _s._security(ctx);
            }

            _operation(ctx: NextCtx, inObs: Observable<In>): Observable<Out> {
                // @ts-ignore
                return _s._operation(ctx, inObs);
            }
        }
    }

    operation(ctx: Context, inObs: Observable<In>): Observable<Out> {
        const fullCtx = {...this.context, ...ctx} as unknown as Context;
        return this._operation(fullCtx, inObs)
    }

    security(ctx: Context): boolean {
        const fullCtx = {...this.context, ...ctx} as unknown as Context;
        return this._security(fullCtx)
    }


    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>):
        OperationStream<In, NextOut, OrEmpty<NextCtx> & OrEmpty<Context>>
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>):
        OperationStream<In, NextOut, OrEmpty<NextCtx> & OrEmpty<Context>>
    chain<NextOut, NextCtx>(opOrStream: Operation<Out, NextOut, NextCtx> | OperationStream<Out, NextOut, NextCtx>):
        OperationStream<In, NextOut, OrEmpty<NextCtx> & OrEmpty<Context>> {

        if (opOrStream.symbol === OperationSymbol) {
            const op = opOrStream as Operation<Out, NextOut, NextCtx>;
            return new BasicOperationStream(List([this, op]))
        } else if (opOrStream.symbol === OperationStreamSymbol) {
            const stream = opOrStream as OperationStream<Out, NextOut, NextCtx>;
            const thisStream = new BasicOperationStream<In, Out, Context>(List([this]));
            return thisStream.join(stream)
        }
        throw new Error('An operation can only be chained with another operation or a stream')
    }

    toJSON() {
        return {opName: this.getOpName(), ctx: this.context}
    }
}
