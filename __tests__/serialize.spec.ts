import {HeadOp, TableGetOp}        from "../src";
import {rehydrateOpStreamFromJson} from "../src/serialization";

describe("Serialization", () => {
    test("should rehydrate a stream", () => {
        // @ts-ignore
        const sIn = new HeadOp<HeadOp<any>>().withContext({head: new HeadOp()}).chain(new TableGetOp())
        const dehydrated = sIn.serialize()

        const out = rehydrateOpStreamFromJson(dehydrated)
        console.log(out)
    })
})
