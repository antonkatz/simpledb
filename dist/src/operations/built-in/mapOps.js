"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicOperation_1 = require("../BasicOperation");
const __1 = require("../..");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const fp_1 = require("lodash/fp");
class ReplaceIfEmpty extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = 'ReplaceIfEmpty';
    }
    _operation(ctx, inObs) {
        return inObs.pipe(operators_1.flatMap(_ => {
            if (_ == null) {
                return ctx.replaceWith.run(rxjs_1.EMPTY, fp_1.omit('replaceWith')(ctx));
            }
            else {
                return rxjs_1.of(_);
            }
        }));
    }
    _security(ctx) {
        return true;
    }
}
exports.ReplaceIfEmpty = ReplaceIfEmpty;
__1.registerOperation(ReplaceIfEmpty);
