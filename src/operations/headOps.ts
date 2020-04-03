import {BasicOperation} from "./Operation"
import {from, Observable} from "rxjs"
import {registerOperation} from "./operationRegistry"

export class HeadOp<V> extends BasicOperation<void, V, { head: V }> {

    protected name: string = "HeadOp";

    // @ts-ignore
    security(ctx: { head: V }): boolean {
        return true
    }

    operation(ctx: { head: V }): Observable<V> {
        return from([ctx.head])
    }
}

registerOperation(HeadOp);

