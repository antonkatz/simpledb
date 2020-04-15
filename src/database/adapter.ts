import {AbstractLevelDOWNConstructor} from "abstract-leveldown";
import {isBrowser}                    from "browser-or-node";

export let DB_ADAPTER: Promise<AbstractLevelDOWNConstructor>;

if (isBrowser) {
    console.warn('Empty DB_ADAPTER');
    // @ts-ignore
    DB_ADAPTER = Promise.resolve("empty")
} else {
    // @ts-ignore
    DB_ADAPTER = import("leveldown").then(imp => imp.default)
}
