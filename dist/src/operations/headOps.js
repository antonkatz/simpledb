import { BasicOperation } from "./Operation";
import { from } from "rxjs";
import { registerOperation } from "./operationRegistry";
export class HeadOp extends BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "HeadOp";
    }
    // @ts-ignore
    security(ctx) {
        return true;
    }
    operation(ctx) {
        return from([ctx.head]);
    }
}
registerOperation(HeadOp);
