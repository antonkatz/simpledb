import { Observable } from "rxjs";
import { TableRecord } from "../../table/Table";
import { BasicOperation } from "../BasicOperation";
export declare abstract class UpdateRecordOp<V, Ctx> extends BasicOperation<TableRecord<V>, TableRecord<V>, Ctx> {
    abstract updateWith(record: V, ctx: Ctx): Observable<Partial<V>>;
    filter(record: V, ctx: Ctx): boolean;
    _operation(ctx: Ctx, inObs: Observable<TableRecord<V>>): Observable<TableRecord<V>>;
}
//# sourceMappingURL=abstractOps.d.ts.map