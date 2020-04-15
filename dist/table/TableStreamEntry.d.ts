declare type _TableStreamEntry<V> = {
    key: string;
    type: string;
    doneResolver: (k: string | undefined) => void;
};
export declare type TablePutEntry<V> = (_TableStreamEntry<V> & {
    value: V;
    type: 'put';
});
export declare type TableStreamEntry<V> = TablePutEntry<V> | (_TableStreamEntry<V> & {
    type: 'del';
});
export declare function isPut<V>(e: TableStreamEntry<V>): e is TablePutEntry<V>;
export {};
//# sourceMappingURL=TableStreamEntry.d.ts.map