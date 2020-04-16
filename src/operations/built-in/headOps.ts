import {from, Observable}  from "rxjs"
import {registerOperation} from "../operationRegistry"
import {BasicOperation}    from "../BasicOperation";

export class HeadOp<V> extends BasicOperation<void, V, { head: V }> {

    protected name: string = "HeadOp";

    // @ts-ignore
    _security(ctx: { head: V }): boolean {
        return true
    }

    _operation(ctx: { head: V }): Observable<V> {
        return from([ctx.head])
    }
}

registerOperation(HeadOp);

