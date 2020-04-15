"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leveldown_1 = __importDefault(require("leveldown"));
const OperationStream_1 = require("../src/execution/OperationStream");
const immutable_1 = require("immutable");
const serialization_1 = require("../src/serialization");
const tableOps_1 = require("../src/operations/built-in/tableOps");
const rxjs_1 = require("rxjs");
const buildTable_1 = require("../src/table/buildTable");
describe('Operation Streams', () => {
    // @ts-ignore
    const adapter = leveldown_1.default;
    const dbApiBuilder = buildTable_1.DbStringApiBuilder(Promise.resolve(adapter));
    const table = dbApiBuilder({ basePath: './db', name: `test-${Date.now()}-1` });
    const getOp = new tableOps_1.TableGetOp().withContext({ table });
    test('should be serializable', () => {
        const chain = immutable_1.List([getOp]);
        const st = new OperationStream_1.BasicOperationStream(chain);
        const json = st.serialize();
        expect(json).toBeTruthy();
    });
    test('should produce deserializable context', () => {
        const chain = immutable_1.List([getOp]);
        const st = new OperationStream_1.BasicOperationStream(chain);
        const json = st.serialize();
        const opStream = serialization_1.rehydrateOpStreamFromJson(json);
        expect(opStream).toBeTruthy();
    });
    test('should be executable after rehydration', async () => {
        await table.put('test', 'value');
        const st = OperationStream_1.buildOpStream(getOp);
        const json = st.serialize();
        const opStream = serialization_1.rehydrateOpStreamFromJson(json);
        opStream.run(rxjs_1.of('test'), {}).subscribe(next => {
            expect(next).toBe('value');
        });
    });
});
