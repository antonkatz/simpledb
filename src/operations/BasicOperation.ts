import {Observable}                                                                   from "rxjs";
import {BasicOperationStream, Operation, OperationStream, OrEmpty, registerOperation} from "..";
import {List}                                                                         from "immutable";
import {OperationStreamSymbol}                                     from "../execution/OperationStream";
import {OmitIntoVoid, OperationSymbol, VoidIfEmpty}                from "./Operation";
import {tap}                                                       from "rxjs/operators";

export abstract class BasicOperation<In, Out, Context> implements Operation<In, Out, Context> {
    readonly symbol = OperationSymbol;

    protected context: any = {};
    protected abstract name: string;

    abstract _security(ctx: Context): boolean

    abstract _operation(ctx: Context, inObs: Observable<In>): Observable<Out>

    getOpName() {
        return this.name
    }

    withContext<PCtx extends Partial<Context>, NextCtx extends OmitIntoVoid<Context, keyof PCtx>>(andContext: PCtx):
        BasicOperation<In, Out, NextCtx> {
        this.context = {...this.context, ...andContext}

        // @ts-ignore
        return this
    }

    operation(ctx: Context, inObs: Observable<In>): Observable<Out> {
        const fullCtx = {...this.context, ...ctx} as unknown as Context;
        let obs = this._operation(fullCtx, inObs)
        if (this.debugOn) obs = obs.pipe(tap(v => {
            console.log(this.getOpName())
            console.log(JSON.stringify(v, null, 2))
        }))
        return obs
    }

    security(ctx: Context): boolean {
        const fullCtx = {...this.context, ...ctx} as unknown as Context;
        return this._security(fullCtx)
    }


    chain<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>):
        OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>
    chain<NextOut, NextCtx>(opStream: OperationStream<Out, NextOut, NextCtx>):
        OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>
    chain<NextOut, NextCtx>(opOrStream: Operation<Out, NextOut, NextCtx> | OperationStream<Out, NextOut, NextCtx>):
        OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>> {

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

    protected debugOn = false
    debug() {
        this.debugOn = true
        return this
    }
}
