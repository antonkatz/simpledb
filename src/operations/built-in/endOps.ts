import {Observable}        from "rxjs";
import {first, take}       from "rxjs/operators";
import {registerOperation} from "../operationRegistry";
import {BasicOperation}    from "../BasicOperation";

export class Once<In> extends BasicOperation<In, In | undefined, void> {
    protected name: string = "Once";

    _operation(ctx: void, inObs: Observable<In>): Observable<In | undefined> {
        return inObs.pipe(
            first(null, undefined)
        );
    }

    _security(ctx: void): boolean {
        return true;
    }

}

registerOperation(Once);
