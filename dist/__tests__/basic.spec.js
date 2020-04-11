"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const leveldown_1 = __importDefault(require("leveldown"));
describe('Simple Database', () => {
    // @ts-ignore
    const adapter = leveldown_1.default;
    const dbApiBuilder = src_1.DbStringApiBuilder(Promise.resolve(adapter));
    test('should put a key-value pair', async (done) => {
        const db = dbApiBuilder({ basePath: './db', name: `test-${Date.now()}-1` });
        await db.put('key', 'value');
        db.get('key').forEach(v => {
            if (v === 'value')
                done();
            else
                fail();
        });
    });
    test('should be able to observe new values', async (done) => {
        const db = dbApiBuilder({ basePath: './db', name: `test-${Date.now()}-2` });
        let finalValue;
        const setValue = jest.fn(v => finalValue = v);
        db.get('key').forEach(v => {
            setValue(v);
        });
        await db.put('key', 'value');
        setTimeout(() => {
            expect(setValue).toBeCalledTimes(1);
            expect(finalValue).toBe('value');
            done();
        }, 1000);
    });
});
