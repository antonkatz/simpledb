import {Map}   from "immutable"
import {Table} from "./Table"

let tableRegistry = Map<string, Table<any>>()

export function getRegisteredTable(name: string) {
    return tableRegistry.get(name)
}

export function registerTable(name: string, table: Table<any>) {
    console.log(`Registering table ${name}`)
    tableRegistry = tableRegistry.set(name, table)
}
