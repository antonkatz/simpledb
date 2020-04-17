"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BasicOperation_1 = require("../../BasicOperation");
const operationRegistry_1 = require("../../operationRegistry");
class Rxjs extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = 'Rxjs';
    }
    _operation(ctx, inObs) {
        return inObs.pipe(ctx.op(...ctx.args));
    }
    _security(ctx) {
        return true;
    }
}
exports.default = Rxjs;
operationRegistry_1.registerOperation(Rxjs);
