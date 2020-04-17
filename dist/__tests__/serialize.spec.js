"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const serialization_1 = require("../src/serialization");
const RxjsPipable_1 = __importDefault(require("../src/operations/built-in/rxjsOps/RxjsPipable"));
const operators_1 = require("rxjs/operators");
const rehydrate_1 = require("../src/serialization/rehydrate");
const rxjs_1 = require("rxjs");
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
    test('should handle rxjs operations', (done) => {
        const op = new RxjsPipable_1.default().withContext({ op: operators_1.startWith, args: [1] });
        const json = op.toJSON();
        const rehydrated = rehydrate_1.rehydrate(json);
        // @ts-ignore
        rehydrated.operation({}, rxjs_1.EMPTY).subscribe(_ => {
            expect(_).toEqual(1);
            done();
        });
        console.log(rehydrated);
    });
});
