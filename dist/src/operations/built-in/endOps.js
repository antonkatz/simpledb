"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const operators_1 = require("rxjs/operators");
const operationRegistry_1 = require("../operationRegistry");
const BasicOperation_1 = require("../BasicOperation");
class Once extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "Once";
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.first());
    }
    _security(ctx) {
        return true;
    }
}
exports.Once = Once;
operationRegistry_1.registerOperation(Once);
