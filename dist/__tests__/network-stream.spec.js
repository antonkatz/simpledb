"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// describe("Streaming network operations", () => {
//     const server = startStreamingServer()
//     const client = new NetworkStream('localhost', 'http:', 3001)
//
//     test('should establish a connection', () => {
//         client.connect()
//     })
//
//     test('should pass operation directives between client and server',  (done) => {
//         const op = new HeadOp<string>().withContext({head: 'TEST'})
//         const opStream = buildOpStream(op)
//
//         const stream = client.requestStream(opStream)
//         stream.subscribe(v => {
//             console.log(`Got from server ${v}`)
//             done()
//         })
//     }, 1000 * 60)
// })
