import {bytesToBase64} from "./socket/base64";
import {isBrowser}     from "browser-or-node";

export let ID_DIGEST: (what: string) => PromiseLike<string>;

if (isBrowser) {
    ID_DIGEST = what => {
        // @ts-ignore
        if (!crypto.subtle.digest) throw new Error('Browser is too old to support hashing');

        // @ts-ignore
        return crypto.subtle.digest("SHA-256", new TextEncoder().encode(what)).then(
            (hashBuffer: ArrayBuffer) => {
                const arr = Array.from(new Uint8Array(hashBuffer));
                return bytesToBase64(arr)
            }
        )
    };
} else {
    ID_DIGEST = what => import('crypto').then(crypto => crypto.createHash('sha256').update(what).digest('base64'))
}
