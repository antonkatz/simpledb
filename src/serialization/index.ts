import {rehydrate}   from "./rehydrate";

export function rehydrateOpStreamFromJson(json: string) {
    return rehydrate(JSON.parse(json))
}

