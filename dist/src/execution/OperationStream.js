import { List } from "immutable";
import { runOp } from "./runOp";
import { SecurityError } from "../Security";
export const OperationStreamSymbol = Symbol();
export class BasicOperationStream {
    constructor(chain = List(), _defaultContext) {
        this.chain = chain;
        this.symbol = OperationStreamSymbol;
        this.defaultContext = {};
        if (_defaultContext) {
            this.defaultContext = _defaultContext;
        }
    }
    setContext(ctx) {
        return new BasicOperationStream(this.chain, { ...this.defaultContext, ...ctx });
    }
    run(input, ctx) {
        const fullCtx = { ...this.defaultContext, ...ctx };
        this.securityCheck(fullCtx);
        const first = this.chain.first();
        if (first) {
            return this.chain.reduce((reduction, op) => {
                const nextReduction = runOp(op, fullCtx, reduction || input);
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
                throw new SecurityError(`OperationStream: Security conditions failed in ${op.getOpName()} ` +
                    `with additional context ${JSON.stringify(ctx)}`);
        });
    }
    add(op) {
        return new BasicOperationStream(this.chain.push(op), this.defaultContext);
    }
    join(otherStream) {
        const thisCtx = { ...(this.defaultContext || {}) };
        const otherCtx = { ...(otherStream.defaultContext || {}) };
        const fullCtx = { ...thisCtx, ...otherCtx };
        return new BasicOperationStream(this.chain.concat(otherStream.chain), fullCtx);
    }
    serialize() {
        const obj = { ctx: this.defaultContext, chain: this.chain.toJSON() };
        return JSON.stringify(obj);
    }
}
export function buildOpStream(op, defaultContext) {
    if (!defaultContext)
        return new BasicOperationStream(List([op]));
    return new BasicOperationStream(List([op]), defaultContext);
}
