import {AbstractLevelDOWNConstructor} from "abstract-leveldown";
import {IS_BROWSER}                   from "../utils";

export let DB_ADAPTER: Promise<AbstractLevelDOWNConstructor>;

if (IS_BROWSER) {
    console.warn('Empty DB_ADAPTER');
    // @ts-ignore
    DB_ADAPTER = Promise.resolve("empty")
} else {
    // @ts-ignore
    DB_ADAPTER = import("leveldown").then(imp => imp.default)
}
