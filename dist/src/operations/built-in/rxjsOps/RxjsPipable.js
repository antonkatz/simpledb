"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicOperation_1 = require("../../BasicOperation");
const operationRegistry_1 = require("../../operationRegistry");
class RxjsPipable extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = 'RxjsPipable';
    }
    _operation(ctx, inObs) {
        return inObs.pipe(ctx.op(...ctx.args));
    }
    _security(ctx) {
        return true;
    }
    toJSON() {
        return { opName: this.getOpName(), ctx: { op: this.context.op.name, args: this.context.args, __type: 'RxjsContext' } };
    }
}
exports.default = RxjsPipable;
operationRegistry_1.registerOperation(RxjsPipable);
