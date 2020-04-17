import {BasicOperation}  from "../BasicOperation";
import {Observable, of}  from "rxjs";
import {filter, flatMap} from "rxjs/operators";
import {registerOperation} from "../operationRegistry";
import {OperationStream}   from "../..";

export class FilterEmpty<T> extends BasicOperation<T | null | undefined, T, void> {
    protected name: string = 'FilterEmpty';

    _operation(ctx: void, inObs: Observable<T | null | undefined>): Observable<T> {
        return inObs.pipe(
            filter(_ => _ != null)
        ) as Observable<T>;
    }

    _security(ctx: void): boolean {
        return true;
    }
}

// fixme unnecessary new creation
registerOperation(FilterEmpty)

export class ApplyIfNotEmpty<T, R> extends BasicOperation<T | null | undefined, R | undefined, {op: OperationStream<T, R, void>}> {
    protected name: string = 'ApplyIfNotEmpty';

    _operation(ctx: { op: OperationStream<T, R, void> },
               inObs: Observable<T | null | undefined>): Observable<R | undefined> {
        return inObs.pipe(
            flatMap(_ => {
                if (_) {
                    return ctx.op.run(of(_))
                } else {
                    return of(undefined)
                }
            })
        );
    }

    _security(ctx: { op: OperationStream<T, R, void> }): boolean {
        return true;
    }
}

registerOperation(ApplyIfNotEmpty)
