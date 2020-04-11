import {Observable} from "rxjs";
import {flatMap, map} from "rxjs/operators";
import {BasicOperation} from "./Operation";
import {TableRecord} from "../Table";

export abstract class UpdateRecordOp<V, Ctx> extends BasicOperation<TableRecord<V>, TableRecord<V>, Ctx> {
    abstract updateWith(record: V, ctx: Ctx): Observable<Partial<V>>

    _operation(ctx: Ctx, inObs: Observable<TableRecord<V>>): Observable<TableRecord<V>> {
        return inObs.pipe(
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

