import {ApplyIfNotEmpty, HeadOp, TableGetOp} from "../src";
import {rehydrateOpStreamFromJson}           from "../src/serialization";
import RxjsPipable                           from "../src/operations/built-in/rxjsOps/RxjsPipable";
import {startWith}                           from "rxjs/operators";
import {rehydrate}                           from "../src/serialization/rehydrate";
import {runOp}                               from "../src/execution/runOp";
import {EMPTY}                               from "rxjs";

describe("Serialization", () => {
    test("should rehydrate a stream", () => {
        // @ts-ignore
        const sIn = new HeadOp<HeadOp<any>>().withContext({head: new HeadOp()}).chain(new TableGetOp())
        const dehydrated = sIn.serialize()

        const out = rehydrateOpStreamFromJson(dehydrated)
        console.log(out)
    })

    test("should rehydrate a stream with stream context", () => {
        // @ts-ignore
        const sIn = new HeadOp<HeadOp<any>>().withContext({head: new HeadOp()}).chain(new TableGetOp())

        const dehydrated = sIn.add(new ApplyIfNotEmpty().withContext({op: sIn})) .serialize()

        const out = rehydrateOpStreamFromJson(dehydrated)
        console.log(out)
    })

    test('should handle rxjs operations', (done) => {
        const op = new RxjsPipable<void, number, [number]>().withContext({op: startWith, args: [1]})
        const json = op.toJSON()
        const rehydrated = rehydrate(json) as RxjsPipable<void, number, [number]>

        // @ts-ignore
        rehydrated.operation({}, EMPTY).subscribe(_ => {
            expect(_).toEqual(1)
            done()
        })

        console.log(rehydrated)
    })
})
