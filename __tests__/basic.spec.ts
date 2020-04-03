import {DbStringApiBuilder} from "../src"
import leveldown from "leveldown"
import {AbstractLevelDOWNConstructor} from "abstract-leveldown"

describe('Simple Database', () => {
    // @ts-ignore
    const adapter: AbstractLevelDOWNConstructor = leveldown
    const dbApiBuilder = DbStringApiBuilder(Promise.resolve(adapter))

    test('should put a key-value pair', async (done) => {
        const db = dbApiBuilder({basePath: './db', name: `test-${Date.now()}-1`})
        await db.put('key', 'value')
        db.get('key').forEach(v => {
            if (v === 'value') done()
            else fail()
        })
    })

    test('should be able to observe new values', async (done) => {
        const db = dbApiBuilder({basePath: './db', name: `test-${Date.now()}-2`})

        let finalValue: string | null
        const setValue = jest.fn(v => finalValue = v)

        db.get('key').forEach(v => {
            setValue(v)
        })

        await db.put('key', 'value')

        setTimeout(() => {
            expect(setValue).toBeCalledTimes(1)
            expect(finalValue).toBe('value')

            done()
        }, 1000)
    })
})
