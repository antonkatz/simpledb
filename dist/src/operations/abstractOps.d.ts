import { Observable } from "rxjs";
import { BasicOperation } from "./Operation";
import { TableRecord } from "../Table";
export declare abstract class UpdateRecordOp<V, Ctx> extends BasicOperation<TableRecord<V>, TableRecord<V>, Ctx> {
    abstract updateWith(record: V, ctx: Ctx): Observable<Partial<V>>;
    _operation(ctx: Ctx, inObs: Observable<TableRecord<V>>): Observable<TableRecord<V>>;
}
//# sourceMappingURL=abstractOps.d.ts.map