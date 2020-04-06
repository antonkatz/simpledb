import { BasicOperation } from "./Operation";
import { from } from "rxjs";
import { registerOperation } from "./operationRegistry";
export class HeadOp extends BasicOperation {
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
        return from([ctx.head]);
    }
}
registerOperation(HeadOp);
