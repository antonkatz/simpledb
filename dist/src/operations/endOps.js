"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Operation_1 = require("./Operation");
const operators_1 = require("rxjs/operators");
const operationRegistry_1 = require("./operationRegistry");
class Once extends Operation_1.BasicOperation {
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
exports.default = {
    Once: operationRegistry_1.registerOperation(Once),
};
