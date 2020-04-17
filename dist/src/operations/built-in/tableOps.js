"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const operationRegistry_1 = require("../operationRegistry");
const BasicOperation_1 = require("../BasicOperation");
class TableGetOp extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TableGetOp";
    }
    _security(ctx) {
        return true;
    }
    _operation(ctx, inObs) {
        // console.log(`TableGetOp ${JSON.stringify(ctx)}`)
        return inObs.pipe(operators_1.flatMap(key => ctx.table.get(key)));
    }
}
exports.TableGetOp = TableGetOp;
operationRegistry_1.registerOperation(TableGetOp);
class TableGetFirstOp extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TableGetFirstOp";
    }
    _security(ctx) {
        return true;
    }
    _operation(ctx, inObs) {
        // console.log(`TableGetFirstOp ${JSON.stringify(ctx)}`)
        return inObs.pipe(operators_1.flatMap(key => ctx.table.get(key)), operators_1.first());
    }
}
exports.TableGetFirstOp = TableGetFirstOp;
operationRegistry_1.registerOperation(TableGetFirstOp);
class TableGetForUpdate extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TableGetForUpdate";
    }
    _security(ctx) {
        return true;
    }
    _operation(ctx, inObs) {
        // console.log(`TableGetForUpdate ${JSON.stringify(ctx)}`)
        return inObs.pipe(operators_1.flatMap(key => ctx.table.get(key).pipe(
        // making sure is not empty and then reconstructing the record
        operators_1.filter(v => !!v), operators_1.map(v => {
            const value = v;
            // console.debug(`Got for update ${JSON.stringify(v)}`)
            return { key, value };
        }))), operators_1.first());
    }
}
exports.TableGetForUpdate = TableGetForUpdate;
operationRegistry_1.registerOperation(TableGetForUpdate);
class TableGetStreamingRange extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TableGetStreamingRange";
    }
    _security(ctx) {
        return true;
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.mergeMap(([start, end]) => {
            const out$ = ctx.table.range(start || undefined, end || undefined);
            return out$;
        }));
    }
}
exports.TableGetStreamingRange = TableGetStreamingRange;
operationRegistry_1.registerOperation(TableGetStreamingRange);
class TablePutOp extends BasicOperation_1.BasicOperation {
    constructor() {
        super();
        this.name = "TablePutOp";
    }
    _security(ctx) {
        return true;
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.flatMap(kv => {
            // console.log(`Putting:\n${JSON.stringify(kv.value, null, 2)}`)
            return ctx.table.put(kv.key, kv.value);
        }));
    }
}
exports.TablePutOp = TablePutOp;
operationRegistry_1.registerOperation(TablePutOp);
class TableFilterNotExists extends BasicOperation_1.BasicOperation {
    constructor() {
        super();
        this.name = "TableFilterNotExists";
    }
    _security(ctx) {
        return true;
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.flatMap(kv => {
            // console.log('filtering on ' + JSON.stringify(kv))
            return ctx.table.get(kv.key).pipe(operators_1.map(existing => [!!existing, kv]), operators_1.first());
        }), operators_1.tap(we => console.log(`Filter res ${this.getOpName()} : ${we}`)), operators_1.filter(withExisting => !withExisting[0]), operators_1.map(withExisting => withExisting[1]));
    }
}
exports.TableFilterNotExists = TableFilterNotExists;
operationRegistry_1.registerOperation(TableFilterNotExists);
// export class UpdateRecordByActionOp<V, Z extends TableRecord<V>, A> extends BasicOperation<Z, Z, {action: A}> {
//     protected name: string = 'UpdateRecordOp';
//
//     constructor(readonly updateWith: (inObs: Observable<Z>, action: A) => Observable<Z>) {
//         super();
//     }
//
//     _operation(ctx: { action: A }, inObs: Observable<Z>): Observable<Z> {
//         return this.updateWith(inObs, ctx.action);
//     }
//
//     _security(ctx: { action: A }): boolean {
//         return true;
//     }
// }
//
// registerOperation()
