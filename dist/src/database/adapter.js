"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const browser_or_node_1 = require("browser-or-node");
if (browser_or_node_1.isBrowser) {
    console.warn('Empty DB_ADAPTER');
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve("empty");
}
else {
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve().then(() => __importStar(require("leveldown"))).then(imp => imp.default);
}
