"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const immutable_1 = require("immutable");
const OperationStream_1 = require("../execution/OperationStream");
const Operation_1 = require("./Operation");
const operators_1 = require("rxjs/operators");
class BasicOperation {
    constructor() {
        this.symbol = Operation_1.OperationSymbol;
        this.context = {};
        this.debugOn = false;
    }
    getOpName() {
        return this.name;
    }
    withContext(andContext) {
        this.context = { ...this.context, ...andContext };
        // @ts-ignore
        return this;
    }
    operation(ctx, inObs) {
        const fullCtx = { ...this.context, ...ctx };
        let obs = this._operation(fullCtx, inObs);
        if (this.debugOn)
            obs = obs.pipe(operators_1.tap(v => {
                console.log(this.getOpName());
                console.log(JSON.stringify(v, null, 2));
            }));
        return obs;
    }
    security(ctx) {
        const fullCtx = { ...this.context, ...ctx };
        return this._security(fullCtx);
    }
    chain(opOrStream) {
        if (opOrStream.symbol === Operation_1.OperationSymbol) {
            const op = opOrStream;
            return new __1.BasicOperationStream(immutable_1.List([this, op]));
        }
        else if (opOrStream.symbol === OperationStream_1.OperationStreamSymbol) {
            const stream = opOrStream;
            const thisStream = new __1.BasicOperationStream(immutable_1.List([this]));
            return thisStream.join(stream);
        }
        throw new Error('An operation can only be chained with another operation or a stream');
    }
    toJSON() {
        return { opName: this.getOpName(), ctx: this.context };
    }
    debug() {
        this.debugOn = true;
        return this;
    }
}
exports.BasicOperation = BasicOperation;
