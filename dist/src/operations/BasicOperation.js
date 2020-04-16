"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const immutable_1 = require("immutable");
const OperationStream_1 = require("../execution/OperationStream");
const Operation_1 = require("./Operation");
class BasicOperation {
    constructor() {
        this.symbol = Operation_1.OperationSymbol;
        this.context = {};
    }
    getOpName() {
        return this.name;
    }
    withContext(andContext) {
        const _s = this;
        const oldContext = this.context;
        return new class extends BasicOperation {
            constructor() {
                super(...arguments);
                this.name = _s.getOpName();
                this.context = { ...oldContext, ...andContext };
            }
            _security(ctx) {
                // @ts-ignore
                return _s._security(ctx);
            }
            _operation(ctx, inObs) {
                // @ts-ignore
                return _s._operation(ctx, inObs);
            }
        };
    }
    operation(ctx, inObs) {
        const fullCtx = { ...this.context, ...ctx };
        return this._operation(fullCtx, inObs);
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
}
exports.BasicOperation = BasicOperation;
