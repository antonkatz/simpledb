import {BasicOperation}                                           from "../BasicOperation";
import {BasicOperationStream, OperationStream, registerOperation} from "../..";
import {EMPTY, Observable, of}                                    from "rxjs";
import {flatMap, map}          from "rxjs/operators";
import { omit } from "lodash/fp";

export class ReplaceIfEmpty<T,R, Ctx> extends BasicOperation<T | null | undefined, R | T, {replaceWith: OperationStream<void, R, Ctx>} & Ctx> {
    protected name: string = 'ReplaceIfEmpty';

    _operation(ctx: { replaceWith: BasicOperationStream<void, R, Ctx> } & Ctx, inObs: Observable<T>): Observable<R | T> {
        return inObs.pipe(
            flatMap(_ => {
                if (_ == null) {
                    return ctx.replaceWith.run(EMPTY, omit('replaceWith')(ctx))
                } else {
                    return of(_)
                }
            })
        );
    }

    _security(ctx: { replaceWith: BasicOperationStream<void, R, Ctx> } & Ctx): boolean {
        return true;
    }

}

registerOperation(ReplaceIfEmpty)
