import { objToOp } from "./operationTransformer";
import { objToTable } from "./tableTransformer";
declare const transformerRegistry: (typeof objToTable | typeof objToOp)[];
export default transformerRegistry;
//# sourceMappingURL=transformerRegistry.d.ts.map