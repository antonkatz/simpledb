import levelup from "levelup"
import {AbstractLevelDOWNConstructor} from "abstract-leveldown"
import {Socket} from 'socket.io'
import {Table} from "./Table"
import {registerTable} from "./tableRegistry"

import {globalBasePath} from "./globalBasePath"
export {globalBasePath}

export type {TableRecord} from './Table'

export {HeadOp} from "./operations/headOps"
export {TableGetOp, TablePutOp, TableFilterNotExists, TableGetForUpdate} from "./operations/tableOps"
export {TrackMaxIdOp, WithIdAsTableKeyOp} from "./operations/idOps"

export {fetchSimpleDb} from './network/http/http-client'
export {default as startStreamingServer} from './network/socket/socket-api'
export {default as NetworkStream} from './network/socket/socket-client'

export {BasicOperation} from "./operations/Operation"
export {buildOpStream, BasicOperationStream, OperationStream} from './execution/OperationStream'
export {rehydrateOpStream} from "./serialization/index"
export {registerOperation} from "./operations/operationRegistry"
export {SecurityError} from './Security'

import {bytesToBase64} from './network/socket/base64'

// @ts-ignore
export let DB_ADAPTER: Promise<AbstractLevelDOWNConstructor>;
export let ID_DIGEST: (what: string) => PromiseLike<string>;

// @ts-ignore
export const IS_BROWSER = typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs

if (IS_BROWSER) {
    console.warn('Empty DB_ADAPTER')
    // @ts-ignore
    DB_ADAPTER = Promise.resolve("empty")
    ID_DIGEST = what => {
        // @ts-ignore
        if (!crypto.subtle.digest) throw new Error('Browser is too old to support hashing')

        // @ts-ignore
        return crypto.subtle.digest("SHA-256", new TextEncoder().encode(what)).then(
            (hashBuffer: ArrayBuffer) => {
                const arr = Array.from(new Uint8Array(hashBuffer))
                return bytesToBase64(arr)
            }
        )
    };
} else {
    // @ts-ignore
    DB_ADAPTER = import("leveldown").then(imp => imp.default)
    ID_DIGEST = what => import('crypto').then(crypto => crypto.createHash('sha256').update(what).digest('base64'))
}

export const DB_STRING_API_BUILDER = DbStringApiBuilder(DB_ADAPTER)
export const TableBuilder = DbApiBuilder(DB_ADAPTER)


export const StringCodec: Codec<string> = {
    dehydrate: v => v,
    rehydrate: raw => raw.toString()
}

export function buildJsonCodec<V>(): Codec<V> {
    return {
        dehydrate: v => JSON.stringify(v),
        rehydrate: raw => JSON.parse(raw.toString()) as V
    }
}

export function DbStringApiBuilder(levelAdapter: Promise<AbstractLevelDOWNConstructor>):
    (options: DbApiOptions) => Table<string> {
    return (options: DbApiOptions) => buildTable(levelAdapter, StringCodec, options.basePath || './db', options)
}

export type Codec<V> = {
    dehydrate: (v: V) => string,
    rehydrate: (raw: Uint8Array) => V
}

export function DbApiBuilder(levelAdapter: Promise<AbstractLevelDOWNConstructor>): <V>(options: DbApiOptions, codec: Codec<V>) => Table<V> {
    return <V>(options: DbApiOptions, codec: Codec<V>) => {
        const relPath = options.basePath || './db'
        return buildTable(levelAdapter, codec, relPath, options)
    }
}

export type DbApiOptions = {
    basePath?: string,
    name: string
}

function buildTable<V>(adapter: Promise<AbstractLevelDOWNConstructor>, codec: Codec<V>, relPath: string, options: DbApiOptions):
    Table<V> {

    const db = globalBasePath.path.then(async basePath => {
        const _a = await adapter
        const path = basePath + relPath + '-' + options.name

        console.debug('Opening DB on path ' + path)

        const _db = _a(path)
        return levelup(_db)
    })
    // todo. indexes will have their own tables created
    const table = new Table(options.name, db, codec)
    registerTable(options.name, table)
    return table
}

