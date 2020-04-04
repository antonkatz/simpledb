import { Map } from "immutable";
let tableRegistry = Map();
export function getRegisteredTable(name) {
    return tableRegistry.get(name);
}
export function registerTable(name, table) {
    console.log(`Registering table ${name}`);
    tableRegistry = tableRegistry.set(name, table);
}
