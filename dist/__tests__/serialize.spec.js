"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const serialization_1 = require("../src/serialization");
describe("Serialization", () => {
    test("should rehydrate a stream", () => {
        // @ts-ignore
        const sIn = new src_1.HeadOp().withContext({ head: new src_1.HeadOp() }).chain(new src_1.TableGetOp());
        const dehydrated = sIn.serialize();
        const out = serialization_1.rehydrateOpStreamFromJson(dehydrated);
        console.log(out);
    });
    test("should rehydrate a stream with stream context", () => {
        // @ts-ignore
        const sIn = new src_1.HeadOp().withContext({ head: new src_1.HeadOp() }).chain(new src_1.TableGetOp());
        const dehydrated = sIn.add(new src_1.ApplyIfNotEmpty().withContext({ op: sIn })).serialize();
        const out = serialization_1.rehydrateOpStreamFromJson(dehydrated);
        console.log(out);
    });
});
