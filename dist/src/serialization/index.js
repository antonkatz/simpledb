import { List } from "immutable";
import { BasicOperationStream } from "../execution/OperationStream";
import transformerRegistry from "./transformerRegistry";
export function rehydrateOpStreamFromJson(json) {
    return rehydrateOpStream(JSON.parse(json));
}
export function rehydrateOpStream(dehydratedOpStream) {
    if (Array.isArray(dehydratedOpStream.chain)) {
        const chain = List(dehydratedOpStream.chain.map(rehydrate));
        const ctx = rehydrate(dehydratedOpStream.ctx || {});
        console.log(`Rehydrated chain\n${JSON.stringify(chain, null, 2)}`);
        return new BasicOperationStream(chain, ctx);
    }
    throw new Error('Stream must be represented as array');
}
export function rehydrate(raw) {
    if (raw && typeof raw === 'object') {
        for (const trans of transformerRegistry) {
            const res = trans(raw);
            if (res) {
                return res;
            }
        }
        const assembled = Array.isArray(raw) ? [] : {};
        for (const k of Object.keys(raw)) {
            // @ts-ignore
            assembled[k] = rehydrate(raw[k]);
        }
        return assembled;
    }
    else {
        return raw;
    }
}
