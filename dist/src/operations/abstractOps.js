import { flatMap, map } from "rxjs/operators";
import { BasicOperation } from "./Operation";
export class UpdateRecordOp extends BasicOperation {
    _operation(ctx, inObs) {
        return inObs.pipe(flatMap(kv => {
            return this.updateWith(kv.value, ctx).pipe(map(value => {
                return { key: kv.key, value: { ...kv.value, ...value } };
            }));
        }));
    }
}
