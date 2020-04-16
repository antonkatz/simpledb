import {BasicOperation}    from "../BasicOperation";
import {Observable}        from "rxjs";
import {filter}            from "rxjs/operators";
import {registerOperation} from "../operationRegistry";

export class FilterEmpty<T> extends BasicOperation<T | null | undefined, T, void> {
    protected name: string = 'FilterEmpty';

    _operation(ctx: void, inObs: Observable<T | null | undefined>): Observable<T> {
        return inObs.pipe(
            filter(_ => _ != null)
        ) as Observable<T>;
    }

    _security(ctx: void): boolean {
        return true;
    }
}

// fixme unnecessary new creation
registerOperation(FilterEmpty)
