export declare type Codec<V> = {
    dehydrate: (v: V) => string;
    rehydrate: (raw: Uint8Array) => V;
};
export declare const StringCodec: Codec<string>;
export declare function buildJsonCodec<V>(): Codec<V>;
//# sourceMappingURL=Codec.d.ts.map