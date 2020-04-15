import {getRegisteredTable} from "../table/tableRegistry"

export function objToTable(obj: any) {
    if (obj.resourceType === "table" && obj.name) {
        const table = getRegisteredTable(obj.name)
        if (!table) {
            throw new Error('Missing table from table registry')
        }
        return table
    }
    return
}
