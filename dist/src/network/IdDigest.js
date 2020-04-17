"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const base64_1 = require("./socket/base64");
const utils_1 = require("../utils");
if (utils_1.IS_BROWSER) {
    exports.ID_DIGEST = what => {
        // @ts-ignore
        if (!crypto.subtle.digest)
            throw new Error('Browser is too old to support hashing');
        // @ts-ignore
        return crypto.subtle.digest("SHA-256", new TextEncoder().encode(what)).then((hashBuffer) => {
            const arr = Array.from(new Uint8Array(hashBuffer));
            return base64_1.bytesToBase64(arr);
        });
    };
}
else {
    exports.ID_DIGEST = what => Promise.resolve().then(() => __importStar(require('crypto'))).then(crypto => crypto.createHash('sha256').update(what).digest('base64'));
}
