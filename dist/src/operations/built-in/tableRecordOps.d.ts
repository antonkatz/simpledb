import { BasicOperation } from "../BasicOperation";
import { TableRecord } from "../..";
import { Observable } from "rxjs";
export declare class TakeKey extends BasicOperation<TableRecord<any>, string, void> {
    protected name: string;
    _operation(ctx: void, inObs: Observable<TableRecord<any>>): Observable<string>;
    _security(ctx: void): boolean;
}
//# sourceMappingURL=tableRecordOps.d.ts.map