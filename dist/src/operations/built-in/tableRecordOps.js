"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicOperation_1 = require("../BasicOperation");
const __1 = require("../..");
const operators_1 = require("rxjs/operators");
class TakeKey extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = 'TakeKey';
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.map(_ => _.key));
    }
    _security(ctx) {
        return true;
    }
}
exports.TakeKey = TakeKey;
__1.registerOperation(TakeKey);
