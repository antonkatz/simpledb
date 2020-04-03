import {Table} from "../Table"
import {BasicOperation} from "./Operation"
import {Observable} from "rxjs"
import {filter, first, flatMap, map, tap} from "rxjs/operators"
import {registerOperation} from "./operationRegistry"

export class TableGetOp<V>
    extends BasicOperation<string, V | undefined, { table: Table<V> }> {
    protected name: string = "TableGetOp";

    security(ctx: { table: Table<V> }): boolean {
        return true
    }

    operation(ctx: { table: Table<V> }, inObs: Observable<string>):
        Observable<V | undefined> {
        console.log(`TableGetOp ${JSON.stringify(ctx)}`)

        return inObs.pipe(
            flatMap(key => ctx.table.get(key))
        )
    }
}

registerOperation(TableGetOp)

export class TableGetFirstOp<V>
    extends BasicOperation<string, V | undefined, { table: Table<V> }> {
    protected name: string = "TableGetFirstOp";

    security(ctx: { table: Table<V> }): boolean {
        return true
    }

    operation(ctx: { table: Table<V> }, inObs: Observable<string>):
        Observable<V | undefined> {
        console.log(`TableGetFirstOp ${JSON.stringify(ctx)}`)

        return inObs.pipe(
            flatMap(key => ctx.table.get(key)),
            first()
        )
    }
}

registerOperation(TableGetFirstOp)

export class TablePutOp<V>
    extends BasicOperation<{key: string, value: V}, string, { table: Table<V> }> {

    protected name: string = "TablePutOp";

    constructor() {
        super();
    }

    security(ctx: { table: Table<V> }): boolean {
        return true
    }

    operation(ctx: { table: Table<V> }, inObs: Observable<{key: string, value: V}>):
        Observable<string> {
        return inObs.pipe(
            flatMap(kv => ctx.table.put(kv.key, kv.value))
        )
    }
}

registerOperation(TablePutOp)

export class TableFilterNotExists<V> extends BasicOperation<{key: string, value: V}, {key: string, value: V}, {table: Table<V>}> {
    protected name = "TableFilterNotExists"

    constructor() {
        super();
    }

    security(ctx: { table: Table<V> }): boolean {
        return true
    }

    operation(ctx: { table: Table<V> }, inObs: Observable<{ key: string }>): Observable<{key: string, value: V}> {
        return inObs.pipe(
            flatMap(kv => {
                // console.log('filtering on ' + JSON.stringify(kv))
                return ctx.table.get(kv.key).pipe(
                    map(existing => [!!existing, kv] as [boolean, {key: string, value: V}]),
                    first()
                )
            }),
            tap(we => console.log(`Filter res ${this.getOpName()} : ${we}`)),
            filter(withExisting => !withExisting[0]),
            map(withExisting => withExisting[1])
        )
    }
}

registerOperation(TableFilterNotExists)
