"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var OperationStream_1 = require("../src/execution/OperationStream");
describe("Streaming network operations", function () {
    var server = src_1.startStreamingServer();
    var client = new src_1.NetworkStream('localhost');
    test('should establish a connection', function () {
        client.connect();
    });
    test('should pass operation directives between client and server', function (done) {
        var op = new src_1.HeadOp().withContext({ head: 'TEST' });
        var opStream = OperationStream_1.buildOpStream(op);
        var stream = client.requestStream(opStream);
        stream.subscribe(function (v) {
            console.log("Got from server " + v);
            done();
        });
    }, 1000 * 60);
});
