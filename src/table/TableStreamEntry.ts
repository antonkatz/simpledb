type _TableStreamEntry<V> = { key: string, type: string, doneResolver: (k: string | undefined) => void }
export type TablePutEntry<V> = (_TableStreamEntry<V> & { value: V, type: 'put' })
export type TableStreamEntry<V> = TablePutEntry<V> | (_TableStreamEntry<V> & { type: 'del' })

export function isPut<V>(e: TableStreamEntry<V>): e is TablePutEntry<V> {
    return e.type === 'put'
}
