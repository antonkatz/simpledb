import { HeadOp, NetworkStream, startStreamingServer } from "../src";
import { buildOpStream } from "../src/execution/OperationStream";
describe("Streaming network operations", () => {
    const server = startStreamingServer();
    const client = new NetworkStream('localhost');
    test('should establish a connection', () => {
        client.connect();
    });
    test('should pass operation directives between client and server', (done) => {
        const op = new HeadOp().withContext({ head: 'TEST' });
        const opStream = buildOpStream(op);
        const stream = client.requestStream(opStream);
        stream.subscribe(v => {
            console.log(`Got from server ${v}`);
            done();
        });
    }, 1000 * 60);
});
