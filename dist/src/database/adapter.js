"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
if (utils_1.IS_BROWSER) {
    console.warn('Empty DB_ADAPTER');
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve("empty");
}
else {
    // @ts-ignore
    exports.DB_ADAPTER = Promise.resolve().then(() => __importStar(require("leveldown"))).then(imp => imp.default);
}
