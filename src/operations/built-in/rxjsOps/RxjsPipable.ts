import {BasicOperation}               from "../../BasicOperation";
import {Observable, OperatorFunction} from "rxjs";
import {registerOperation}            from "../../operationRegistry";

export type RxjsContext<In, Out, Args extends any[]> = { op: (...args: Args) => OperatorFunction<In, Out>, args: Args }

export default class RxjsPipable<In, Out, Args extends any[]> extends BasicOperation<In, Out, RxjsContext<In, Out, Args>> {
    protected name: string = 'RxjsPipable';

    _operation(ctx: { op: any; args: Args }, inObs: Observable<In>): Observable<Out> {
        return inObs.pipe(
            ctx.op(...ctx.args)
        );
    }

    _security(ctx: { op: any; args: Args }): boolean {
        return true;
    }

    toJSON(): { opName: string; ctx: any } {
        return {opName: this.getOpName(), ctx: {op: this.context.op.name, args: this.context.args, __type: 'RxjsContext'}}
    }
}

registerOperation(RxjsPipable);
