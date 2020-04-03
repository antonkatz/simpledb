"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Security_1 = require("../Security");
function runOp(op, additionalCtx, inObs) {
    if (op.security(additionalCtx)) {
        return op.operation(additionalCtx, inObs);
    }
    else {
        throw new Security_1.SecurityError("Security conditions failed in " + op.getOpName() + " with " +
            ("additional context " + JSON.stringify(additionalCtx)));
    }
}
exports.runOp = runOp;
