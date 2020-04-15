"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const immutable_1 = require("immutable");
const runOp_1 = require("./runOp");
const Security_1 = require("../security/Security");
exports.OperationStreamSymbol = Symbol();
class BasicOperationStream {
    constructor(chain = immutable_1.List(), _defaultContext) {
        this.chain = chain;
        this.symbol = exports.OperationStreamSymbol;
        this.innerContext = {};
        if (_defaultContext) {
            this.innerContext = _defaultContext;
        }
    }
    getContext() {
        return this.innerContext;
    }
    setContext(ctx) {
        return new BasicOperationStream(this.chain, { ...this.innerContext, ...ctx });
    }
    run(input, ctx) {
        const fullCtx = { ...this.innerContext, ...ctx };
        this.securityCheck(fullCtx);
        const first = this.chain.first();
        if (first) {
            return this.chain.reduce((reduction, op) => {
                const nextReduction = runOp_1.runOp(op, fullCtx, reduction || input);
                if (!nextReduction) {
                    throw new Error(`Operation Stream failed at ${op.constructor.name || op.getOpName()}`);
                }
                return nextReduction;
            }, null);
        }
        throw new Error("Operation Stream must have at least one operation");
    }
    securityCheck(ctx) {
        this.chain.forEach(op => {
            const c = op.security(ctx);
            if (!c)
                throw new Security_1.SecurityError(`OperationStream: Security conditions failed in ${op.getOpName()} ` +
                    `with additional context ${JSON.stringify(ctx)}`);
        });
    }
    add(op) {
        return new BasicOperationStream(this.chain.push(op), this.innerContext);
    }
    join(otherStream) {
        const thisCtx = { ...(this.innerContext || {}) };
        const otherCtx = { ...(otherStream.getContext() || {}) };
        const fullCtx = { ...thisCtx, ...otherCtx };
        return new BasicOperationStream(this.chain.concat(otherStream.chain), fullCtx);
    }
    serialize() {
        const obj = { ctx: this.innerContext, chain: this.chain.toJSON() };
        return JSON.stringify(obj);
    }
}
exports.BasicOperationStream = BasicOperationStream;
function buildOpStream(op, defaultContext) {
    if (!defaultContext)
        return new BasicOperationStream(immutable_1.List([op]));
    return new BasicOperationStream(immutable_1.List([op]), defaultContext);
}
exports.buildOpStream = buildOpStream;
