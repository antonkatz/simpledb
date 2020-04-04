import leveldown from "leveldown";
import { DbStringApiBuilder } from "../src";
import { BasicOperationStream, buildOpStream } from "../src/execution/OperationStream";
import { List } from "immutable";
import { rehydrateOpStreamFromJson } from "../src/serialization";
import { TableGetOp } from "../src/operations/tableOps";
import { of } from "rxjs";
describe('Operation Streams', () => {
    // @ts-ignore
    const adapter = leveldown;
    const dbApiBuilder = DbStringApiBuilder(Promise.resolve(adapter));
    const table = dbApiBuilder({ basePath: './db', name: `test-${Date.now()}-1` });
    const getOp = new TableGetOp().withContext({ table });
    test('should be serializable', () => {
        const chain = List([getOp]);
        const st = new BasicOperationStream(chain);
        const json = st.serialize();
        expect(json).toBeTruthy();
    });
    test('should produce deserializable context', () => {
        const chain = List([getOp]);
        const st = new BasicOperationStream(chain);
        const json = st.serialize();
        const opStream = rehydrateOpStreamFromJson(json);
        expect(opStream).toBeTruthy();
    });
    test('should be executable after rehydration', async () => {
        await table.put('test', 'value');
        const st = buildOpStream(getOp);
        const json = st.serialize();
        const opStream = rehydrateOpStreamFromJson(json);
        opStream.run(of('test'), {}).subscribe(next => {
            expect(next).toBe('value');
        });
    });
});
