export async function fetchSimpleDb(opStream) {
    const url = new URL('api/simpledb', window.location.toString());
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    const resp = await fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify(opStream),
        headers
    });
    return resp.json();
}
