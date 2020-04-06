import { BasicOperationStream, OperationStreamSymbol } from "../execution/OperationStream";
import { List } from "immutable";
export const OperationSymbol = Symbol();
export class BasicOperation {
    constructor() {
        this.symbol = OperationSymbol;
        this.context = {};
    }
    getOpName() {
        return this.name;
    }
    withContext(andContext) {
        const _s = this;
        return new class extends BasicOperation {
            constructor() {
                super(...arguments);
                this.name = _s.getOpName();
            }
            operation(ctx, inObs) {
                const fullCtx = { ...andContext, ...ctx };
                return _s.operation(fullCtx, inObs);
            }
            security(ctx) {
                const fullCtx = { ...andContext, ...ctx };
                return _s.security(fullCtx);
            }
        };
    }
    chain(opOrStream) {
        if (opOrStream.symbol === OperationSymbol) {
            const op = opOrStream;
            return new BasicOperationStream(List([this, op]));
        }
        else if (opOrStream.symbol === OperationStreamSymbol) {
            const stream = opOrStream;
            const thisStream = new BasicOperationStream(List([this]));
            return thisStream.join(stream);
        }
        throw new Error('An operation can only be chained with another or a stream');
    }
    toJSON() {
        return { opName: this.getOpName(), ctx: this.context };
    }
}
