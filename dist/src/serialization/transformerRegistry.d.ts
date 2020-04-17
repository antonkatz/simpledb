import { objToTable } from "./tableTransformer";
import { objToOp } from "./operationTransformer";
import { objToStream } from "./operationStreamTransformer";
import { objToRxjsContext } from "./rxjsContextTransformer";
export declare const transformerRegistry: (typeof objToRxjsContext | typeof objToTable | typeof objToOp | typeof objToStream)[];
//# sourceMappingURL=transformerRegistry.d.ts.map