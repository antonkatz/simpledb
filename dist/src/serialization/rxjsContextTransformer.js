"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rehydrate_1 = require("./rehydrate");
const rxjsOperators = __importStar(require("rxjs/operators"));
function objToRxjsContext(raw) {
    if (raw.__type === 'RxjsContext') {
        if (raw.op) {
            // @ts-ignore
            const op = rxjsOperators[raw.op];
            const args = rehydrate_1.rehydrate(raw.args || []);
            return { op, args };
        }
        throw new Error('Operation name should be an rxjs operation');
    }
    return undefined;
}
exports.objToRxjsContext = objToRxjsContext;
