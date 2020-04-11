"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const Operation_1 = require("./Operation");
class UpdateRecordOp extends Operation_1.BasicOperation {
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.flatMap(kv => {
            return this.updateWith(kv.value, ctx).pipe(operators_1.map(value => {
                return { key: kv.key, value: { ...kv.value, ...value } };
            }));
        }));
    }
}
exports.UpdateRecordOp = UpdateRecordOp;
