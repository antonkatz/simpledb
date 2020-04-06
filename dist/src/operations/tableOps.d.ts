import { Table, TableRecord } from "../Table";
import { BasicOperation } from "./Operation";
import { Observable } from "rxjs";
export declare class TableGetOp<V> extends BasicOperation<string, V | undefined, {
    table: Table<V>;
}> {
    protected name: string;
    _security(ctx: {
        table: Table<V>;
    }): boolean;
    _operation(ctx: {
        table: Table<V>;
    }, inObs: Observable<string>): Observable<V | undefined>;
}
export declare class TableGetFirstOp<V> extends BasicOperation<string, V | undefined, {
    table: Table<V>;
}> {
    protected name: string;
    _security(ctx: {
        table: Table<V>;
    }): boolean;
    _operation(ctx: {
        table: Table<V>;
    }, inObs: Observable<string>): Observable<V | undefined>;
}
export declare class TableGetForUpdate<V> extends BasicOperation<string, TableRecord<V>, {
    table: Table<V>;
}> {
    protected name: string;
    _security(ctx: {
        table: Table<V>;
    }): boolean;
    _operation(ctx: {
        table: Table<V>;
    }, inObs: Observable<string>): Observable<TableRecord<V>>;
}
export declare class TablePutOp<V> extends BasicOperation<{
    key: string;
    value: V;
}, string, {
    table: Table<V>;
}> {
    protected name: string;
    constructor();
    _security(ctx: {
        table: Table<V>;
    }): boolean;
    _operation(ctx: {
        table: Table<V>;
    }, inObs: Observable<{
        key: string;
        value: V;
    }>): Observable<string>;
}
export declare class TableFilterNotExists<V> extends BasicOperation<{
    key: string;
    value: V;
}, {
    key: string;
    value: V;
}, {
    table: Table<V>;
}> {
    protected name: string;
    constructor();
    _security(ctx: {
        table: Table<V>;
    }): boolean;
    _operation(ctx: {
        table: Table<V>;
    }, inObs: Observable<{
        key: string;
    }>): Observable<{
        key: string;
        value: V;
    }>;
}
//# sourceMappingURL=tableOps.d.ts.map