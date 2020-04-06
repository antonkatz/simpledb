import { BasicOperation } from "./Operation";
import { registerOperation } from "./operationRegistry";
import { first, map, tap } from "rxjs/operators";
export const MAX_KEY_METADATA_KEY = 'maxKey';
export class TrackMaxIdOp extends BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "TrackMaxIdOp";
    }
    _operation(ctx, inObs) {
        const f = (id) => TrackMaxIdOp.replaceIfGreater(ctx.metadataTable, id);
        return inObs.pipe(tap(f));
    }
    static async replaceIfGreater(metaTable, id) {
        console.log(`Comparing key with max ${id}`);
        const max = await metaTable.get('maxKey').pipe(first()).toPromise();
        console.log(`Current max id in ${metaTable.name}: ${max}`);
        if (id > (max || '0')) {
            metaTable.put(MAX_KEY_METADATA_KEY, id);
        }
    }
    _security(ctx) {
        return true;
    }
}
registerOperation(TrackMaxIdOp);
export class WithIdAsTableKeyOp extends BasicOperation {
    constructor() {
        super(...arguments);
        this.name = "WithIdAsTableKeyOp";
    }
    _operation(ctx, inObs) {
        return inObs.pipe(map(obj => ({ key: obj.id, value: obj })));
    }
    _security(ctx) {
        return true;
    }
}
registerOperation(WithIdAsTableKeyOp);
