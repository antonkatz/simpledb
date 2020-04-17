import { BasicOperation } from "../../BasicOperation";
import { Observable } from "rxjs";
import { OperatorFunction } from "rxjs/src/internal/types";
export declare type RxjsContext<In, Out, Args extends any[]> = {
    op: (...args: Args) => OperatorFunction<In, Out>;
    args: Args;
};
export default class Rxjs<In, Out, Args extends any[]> extends BasicOperation<In, Out, RxjsContext<In, Out, Args>> {
    protected name: string;
    _operation(ctx: {
        op: any;
        args: Args;
    }, inObs: Observable<In>): Observable<Out>;
    _security(ctx: {
        op: any;
        args: Args;
    }): boolean;
}
//# sourceMappingURL=Rxjs.d.ts.map