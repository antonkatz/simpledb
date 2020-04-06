import { BasicOperation } from "./Operation";
import { Table } from "../Table";
import { Observable } from "rxjs";
export declare const MAX_KEY_METADATA_KEY = "maxKey";
export declare class TrackMaxIdOp extends BasicOperation<string, string, {
    metadataTable: Table<string>;
}> {
    protected name: string;
    operation(ctx: {
        metadataTable: Table<string>;
    }, inObs: Observable<string>): Observable<string>;
    private static replaceIfGreater;
    security(ctx: {
        metadataTable: Table<string>;
    }): boolean;
}
export declare class WithIdAsTableKeyOp<In extends {
    id: string;
}> extends BasicOperation<In, {
    key: string;
    value: In;
}, {}> {
    protected name: string;
    operation(ctx: {}, inObs: Observable<In>): Observable<{
        key: string;
        value: In;
    }>;
    security(ctx: {}): boolean;
}
//# sourceMappingURL=idOps.d.ts.map