import {DB_ADAPTER}                   from "../database/adapter";
import {AbstractLevelDOWNConstructor} from "abstract-leveldown";
import {buildJsonCodec, Codec}        from "./Codec";
import {Table}                        from "./Table";
import levelup                        from "levelup";
import {registerTable}                from "./tableRegistry";
import {curry}                        from 'lodash/fp'
import DbBasePath                     from "../database/DbBasePath";

export type DbApiOptions = {
    name: string
    relativePath?: string,
}

/** @deprecated use `buildTable()` instead */
export const TableBuilder: <V>(options: DbApiOptions, codec?: Codec<V>) => Table<V> = curry(_buildTable)(DB_ADAPTER);
export const buildTable: <V>(options: DbApiOptions, codec?: Codec<V>) => Table<V> = curry(_buildTable)(DB_ADAPTER);

function _buildTable<V>(adapter: Promise<AbstractLevelDOWNConstructor>, options: DbApiOptions, codec: Codec<V> = buildJsonCodec()): Table<V> {
    const relPath = options.relativePath || '';

    const db = DbBasePath.path.then(async basePath => {
        const _a = await adapter;
        const path = basePath + relPath + 'db-' + options.name;

        console.debug('Opening DB on path ' + path);

        const _db = _a(path);
        return levelup(_db)
    });

    const table = new Table(options.name, db, codec);
    registerTable(options.name, table);
    return table
}
