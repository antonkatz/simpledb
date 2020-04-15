"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operationRegistry_1 = require("./operationRegistry");
const BasicOperation_1 = require("./BasicOperation");
class HeadOp extends BasicOperation_1.BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "HeadOp";
    }
    // @ts-ignore
    _security(ctx) {
        return true;
    }
    _operation(ctx) {
        console.log(`${this.name} executed with context ${JSON.stringify(ctx)}`);
        return rxjs_1.from([ctx.head]);
    }
}
exports.HeadOp = HeadOp;
operationRegistry_1.registerOperation(HeadOp);
