import { NEVER } from "rxjs";
import { first } from "rxjs/operators";
import { globalBasePath } from "../../globalBasePath";
import { SecurityError } from "../../Security";
import { rehydrateOpStream } from "../../serialization";
globalBasePath.setPath('../../');
// @ts-ignore
export default async function HttpEndpoint(req, res) {
    const streamRequest = req.body;
    res.statusCode = 500;
    if (streamRequest) {
        try {
            const opStream = rehydrateOpStream(streamRequest);
            const streamRes = await opStream.run(NEVER, {}).pipe(first()).toPromise();
            res.statusCode = 200;
            res.end(JSON.stringify(streamRes));
        }
        catch (e) {
            if (e instanceof SecurityError) {
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
