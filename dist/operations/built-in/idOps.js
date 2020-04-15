"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operationRegistry_1 = require("../operationRegistry");
const operators_1 = require("rxjs/operators");
const BasicOperation_1 = require("../BasicOperation");
exports.MAX_KEY_METADATA_KEY = 'maxKey';
class TrackMaxIdOp extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TrackMaxIdOp";
    }
    _operation(ctx, inObs) {
        const f = (id) => TrackMaxIdOp.replaceIfGreater(ctx.metadataTable, id);
        return inObs.pipe(operators_1.tap(f));
    }
    static async replaceIfGreater(metaTable, id) {
        console.log(`Comparing key with max ${id}`);
        const max = await metaTable.get('maxKey').pipe(operators_1.first()).toPromise();
        console.log(`Current max id in ${metaTable.name}: ${max}`);
        if (id > (max || '0')) {
            metaTable.put(exports.MAX_KEY_METADATA_KEY, id);
        }
    }
    _security(ctx) {
        return true;
    }
}
exports.TrackMaxIdOp = TrackMaxIdOp;
operationRegistry_1.registerOperation(TrackMaxIdOp);
class WithIdAsTableKeyOp extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "WithIdAsTableKeyOp";
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.map(obj => ({ key: obj.id, value: obj })));
    }
    _security(ctx) {
        return true;
    }
}
exports.WithIdAsTableKeyOp = WithIdAsTableKeyOp;
operationRegistry_1.registerOperation(WithIdAsTableKeyOp);
