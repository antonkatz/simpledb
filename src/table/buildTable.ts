import {DB_ADAPTER}                   from "../database/adapter";
import {AbstractLevelDOWNConstructor} from "abstract-leveldown";
import {buildJsonCodec, Codec}        from "./Codec";
import {Table}                        from "./Table";
import {globalBasePath}               from "..";
import levelup         from "levelup";
import {registerTable} from "./tableRegistry";
import {curry}         from 'lodash/fp'

export type DbApiOptions = {
    basePath?: string,
    name: string
}

/** @deprecated use `buildTable()` instead */
export const TableBuilder: <V>(options: DbApiOptions, codec?: Codec<V>) => Table<V> = curry(_buildTable)(DB_ADAPTER);
export const buildTable = TableBuilder;

function _buildTable<V>(adapter: Promise<AbstractLevelDOWNConstructor>, options: DbApiOptions, codec: Codec<V> = buildJsonCodec()): Table<V> {
    const relPath = options.basePath || './db';

    const db = globalBasePath.path.then(async basePath => {
        const _a = await adapter;
        const path = basePath + relPath + '-' + options.name;

        console.debug('Opening DB on path ' + path);

        const _db = _a(path);
        return levelup(_db)
    });

    const table = new Table(options.name, db, codec);
    registerTable(options.name, table);
    return table
}
