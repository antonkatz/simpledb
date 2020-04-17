import {transformerRegistry} from "./transformerRegistry";

export function rehydrate(raw: any): any {
    if (raw && typeof raw === 'object') {
        for (const trans of transformerRegistry) {
            const res = trans(raw)
            if (res) {
                return res
            }
        }

        const assembled = Array.isArray(raw) ? [] : {}
        for (const k of Object.keys(raw)) {
            // @ts-ignore
            assembled[k] = rehydrate(raw[k])
        }
        return assembled
    } else {
        return raw
    }
}
