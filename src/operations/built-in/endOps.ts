import {Observable}        from "rxjs";
import {first}             from "rxjs/operators";
import {registerOperation} from "../operationRegistry";
import {BasicOperation}    from "../BasicOperation";

class Once<In> extends BasicOperation<In, In, never> {
    protected name: string = "Once";

    _operation(ctx: never, inObs: Observable<In>): Observable<In> {
        return inObs.pipe(
            first()
        );
    }

    _security(ctx: never): boolean {
        return true;
    }

}

export default {
    Once: registerOperation(Once),
}
