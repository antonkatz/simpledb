"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicOperation_1 = require("../BasicOperation");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const operationRegistry_1 = require("../operationRegistry");
class FilterEmpty extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = 'FilterEmpty';
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.filter(_ => _ != null));
    }
    _security(ctx) {
        return true;
    }
}
exports.FilterEmpty = FilterEmpty;
// fixme unnecessary new creation
operationRegistry_1.registerOperation(FilterEmpty);
class ApplyIfNotEmpty extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = 'ApplyIfNotEmpty';
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.flatMap(_ => {
            if (_) {
                return ctx.op.run(rxjs_1.of(_));
            }
            else {
                return rxjs_1.of(undefined);
            }
        }));
    }
    _security(ctx) {
        return true;
    }
}
exports.ApplyIfNotEmpty = ApplyIfNotEmpty;
operationRegistry_1.registerOperation(ApplyIfNotEmpty);
