import {OperationStream} from "../../execution/OperationStream"

export async function fetchSimpleDb<Out>(opStream: OperationStream<void,Out,{}>): Promise<Out> {
    const url = new URL('api/simpledb', window.location.toString())

    const headers = new Headers()
    headers.append("Content-Type", "application/json")
    const resp = await fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify(opStream),
        headers
    })

    return resp.json()
}
