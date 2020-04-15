export type Codec<V> = {
    dehydrate: (v: V) => string,
    rehydrate: (raw: Uint8Array) => V
}

export const StringCodec: Codec<string> = {
    dehydrate: v => v,
    rehydrate: raw => raw.toString()
}

export function buildJsonCodec<V>(): Codec<V> {
    return {
        dehydrate: v => JSON.stringify(v),
        rehydrate: raw => JSON.parse(raw.toString()) as V
    }
}
