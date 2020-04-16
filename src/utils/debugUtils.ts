import {TableStreamEntry} from "..";
import {Table}            from "../table/Table";
import { curry } from "lodash/fp";

function _debugWatcher(table: Table<any>, e: TableStreamEntry<any>) {
    if (process && process.env && process.env.NODE_ENV !== 'production')
    console.debug(table.name)
    console.debug(JSON.stringify(e, null, 2))
}

export const debugWatcher = curry(_debugWatcher)
