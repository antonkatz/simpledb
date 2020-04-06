import {BasicOperation} from "./Operation"
import {from, Observable} from "rxjs"
import {registerOperation} from "./operationRegistry"

export class HeadOp<V> extends BasicOperation<void, V, { head: V }> {

    protected name: string = "HeadOp";

    // @ts-ignore
    _security(ctx: { head: V }): boolean {
        return true
    }

    _operation(ctx: { head: V }): Observable<V> {
        console.log(`${this.name} executed with context ${JSON.stringify(ctx)}`)
        return from([ctx.head])
    }
}

registerOperation(HeadOp);

