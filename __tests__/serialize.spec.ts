import {ApplyIfNotEmpty, HeadOp, TableGetOp} from "../src";
import {rehydrateOpStreamFromJson}           from "../src/serialization";

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
})
