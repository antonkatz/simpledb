import {Table}             from "../../table/Table";
import {Observable}        from "rxjs";
import {registerOperation} from "../operationRegistry";
import {first, map, tap}   from "rxjs/operators";
import {BasicOperation}    from "../BasicOperation";

export const MAX_KEY_METADATA_KEY = 'maxKey'

export class TrackMaxIdOp extends BasicOperation<string, string, {metadataTable: Table<string>}> {

    protected name: string = "TrackMaxIdOp";

    _operation(ctx: { metadataTable: Table<string> }, inObs: Observable<string>): Observable<string> {
        const f = (id: string) => TrackMaxIdOp.replaceIfGreater(ctx.metadataTable, id);
        return inObs.pipe(
            tap(f)
        );
    }

    private static async replaceIfGreater(metaTable: Table<string>, id: string) {
        console.log(`Comparing key with max ${id}`)
        const max = await metaTable.get('maxKey').pipe(first()).toPromise();
        console.log(`Current max id in ${metaTable.name}: ${max}`);
        if (id > (max || '0')) {
            metaTable.put(MAX_KEY_METADATA_KEY, id)
        }
    }

    _security(ctx: { metadataTable: Table<string> }): boolean {
        return true;
    }
}

registerOperation(TrackMaxIdOp);

export class WithIdAsTableKeyOp<In extends { id: string }> extends BasicOperation<In, {key: string, value: In}, {}> {
    protected name = "WithIdAsTableKeyOp"

    _operation(ctx: {}, inObs: Observable<In>): Observable<{ key: string; value: In }> {
        return inObs.pipe(
            map(obj => ({key: obj.id, value: obj}))
        )
    }

    _security(ctx: {}): boolean {
        return true;
    }
}

registerOperation(WithIdAsTableKeyOp)
