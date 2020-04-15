import {Observable}           from "rxjs";
import {flatMap, map, filter} from "rxjs/operators";
import {TableRecord}          from "../../table/Table";
import {BasicOperation}       from "../BasicOperation";

export abstract class UpdateRecordOp<V, Ctx> extends BasicOperation<TableRecord<V>, TableRecord<V>, Ctx> {
    abstract updateWith(record: V, ctx: Ctx): Observable<Partial<V>>

    filter(record: V, ctx: Ctx): boolean {
        return true
    }

    _operation(ctx: Ctx, inObs: Observable<TableRecord<V>>): Observable<TableRecord<V>> {
        return inObs.pipe(
            filter(kv => this.filter(kv.value, ctx)),
            flatMap(kv => {
                return this.updateWith(kv.value, ctx).pipe(
                    map(value => {
                        return {key: kv.key, value: {...kv.value, ...value}}
                    })
                )
            })
        );
    }
}

