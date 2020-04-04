import { BasicOperation } from "./Operation";
import { filter, first, flatMap, map, tap } from "rxjs/operators";
import { registerOperation } from "./operationRegistry";
export class TableGetOp extends BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TableGetOp";
    }
    security(ctx) {
        return true;
    }
    operation(ctx, inObs) {
        console.log(`TableGetOp ${JSON.stringify(ctx)}`);
        return inObs.pipe(flatMap(key => ctx.table.get(key)));
    }
}
registerOperation(TableGetOp);
export class TableGetFirstOp extends BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TableGetFirstOp";
    }
    security(ctx) {
        return true;
    }
    operation(ctx, inObs) {
        console.log(`TableGetFirstOp ${JSON.stringify(ctx)}`);
        return inObs.pipe(flatMap(key => ctx.table.get(key)), first());
    }
}
registerOperation(TableGetFirstOp);
export class TableGetForUpdate extends BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TableGetForUpdate";
    }
    security(ctx) {
        return true;
    }
    operation(ctx, inObs) {
        console.log(`TableGetFirstOp ${JSON.stringify(ctx)}`);
        return inObs.pipe(flatMap(key => ctx.table.get(key).pipe(
        // making sure is not empty and then reconstructing the record
        filter(v => !!v), map(v => {
            const value = v;
            return { key, value };
        }))), first());
    }
}
registerOperation(TableGetForUpdate);
export class TablePutOp extends BasicOperation {
    constructor() {
        super();
        this.name = "TablePutOp";
    }
    security(ctx) {
        return true;
    }
    operation(ctx, inObs) {
        return inObs.pipe(flatMap(kv => {
            console.log(`Putting:\n${JSON.stringify(kv.value, null, 2)}`);
            return ctx.table.put(kv.key, kv.value);
        }));
    }
}
registerOperation(TablePutOp);
export class TableFilterNotExists extends BasicOperation {
    constructor() {
        super();
        this.name = "TableFilterNotExists";
    }
    security(ctx) {
        return true;
    }
    operation(ctx, inObs) {
        return inObs.pipe(flatMap(kv => {
            // console.log('filtering on ' + JSON.stringify(kv))
            return ctx.table.get(kv.key).pipe(map(existing => [!!existing, kv]), first());
        }), tap(we => console.log(`Filter res ${this.getOpName()} : ${we}`)), filter(withExisting => !withExisting[0]), map(withExisting => withExisting[1]));
    }
}
registerOperation(TableFilterNotExists);
// export class UpdateRecordByActionOp<V, Z extends TableRecord<V>, A> extends BasicOperation<Z, Z, {action: A}> {
//     protected name: string = 'UpdateRecordOp';
//
//     constructor(readonly updateWith: (inObs: Observable<Z>, action: A) => Observable<Z>) {
//         super();
//     }
//
//     operation(ctx: { action: A }, inObs: Observable<Z>): Observable<Z> {
//         return this.updateWith(inObs, ctx.action);
//     }
//
//     security(ctx: { action: A }): boolean {
//         return true;
//     }
// }
//
// registerOperation()
