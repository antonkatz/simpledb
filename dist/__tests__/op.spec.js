"use strict";
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leveldown_1 = __importDefault(require("leveldown"));
const src_1 = require("../src");
describe('Operations', () => {
    // @ts-ignore
    const adapter = leveldown_1.default;
    const dbApiBuilder = src_1.DbStringApiBuilder(Promise.resolve(adapter));
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
