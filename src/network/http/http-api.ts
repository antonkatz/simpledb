import {NEVER}             from "rxjs"
import {first}             from "rxjs/operators"
import {SecurityError}     from "../../security/Security";
import {rehydrate}         from "../../serialization/rehydrate";

// @ts-ignore
export default async function HttpEndpoint (req, res) {
    const streamRequest = req.body;
    res.statusCode = 500;

    if (streamRequest) {
        try {

            const opStream = rehydrate(streamRequest);

            const streamRes = await opStream.run(NEVER, {}).pipe(
                first(),
            ).toPromise();

            res.statusCode = 200;
            res.end(JSON.stringify(streamRes))
        } catch (e) {
            if (e instanceof SecurityError) {
                res.statusCode = 400;
                res.end(e.message)
            }
            console.error(e)
        }
    } else {
        res.end()
    }
}
