import {BasicOperation}                 from "../BasicOperation";
import {registerOperation, TableRecord} from "../..";
import {Observable}                     from "rxjs";
import { map } from "rxjs/operators";

export class TakeKey extends BasicOperation<TableRecord<any>, string, void> {
    protected name: string = 'TakeKey';

    _operation(ctx: void, inObs: Observable<TableRecord<any>>): Observable<string> {
        return inObs.pipe(
            map(_ => _.key)
        );
    }

    _security(ctx: void): boolean {
        return true;
    }

}

registerOperation(TakeKey)
