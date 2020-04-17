"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const Security_1 = require("../../security/Security");
const rehydrate_1 = require("../../serialization/rehydrate");
// @ts-ignore
async function HttpEndpoint(req, res) {
    const streamRequest = req.body;
    res.statusCode = 500;
    if (streamRequest) {
        try {
            const opStream = rehydrate_1.rehydrate(streamRequest);
            const streamRes = await opStream.run(rxjs_1.NEVER, {}).pipe(operators_1.first()).toPromise();
            res.statusCode = 200;
            res.end(JSON.stringify(streamRes));
        }
        catch (e) {
            if (e instanceof Security_1.SecurityError) {
                res.statusCode = 400;
                res.end(e.message);
            }
            console.error(e);
        }
    }
    else {
        res.end();
    }
}
exports.default = HttpEndpoint;
