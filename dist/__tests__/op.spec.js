// @ts-nocheck
import leveldown from "leveldown";
import { DbStringApiBuilder } from "../src";
describe('Operations', () => {
    // @ts-ignore
    const adapter = leveldown;
    const dbApiBuilder = DbStringApiBuilder(Promise.resolve(adapter));
    test.skip('GetKeyValue operation', async (done) => {
        // const db = dbApiBuilder({basePath: './db', name: `test-${Date.now()}-1`}) as Table<string | undefined>
        // await db.put('key', 'value')
        //
        // const opRes = new TableGetOp().do({table: db, key: 'key'}, null)
        // if (!opRes) fail()
        //
        // opRes.forEach(v => {
        //     if (v === 'value') done()
        //     else fail()
        // })
    });
});
