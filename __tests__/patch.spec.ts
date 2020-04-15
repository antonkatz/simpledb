import {buildTable}                   from "../src";
import l_                             from 'lodash/fp'
import {original, produceWithPatches}                from "immer";
import {combineLatest, from, Observable, timer, zip} from "rxjs";
import {take, tap}                                   from "rxjs/operators";

const table = buildTable<{sum: number, constant: string}>({name: 'patch'})

describe('Patching', () => {
    afterAll((done) => table.del('id').then(() => done()))
    beforeAll((done) => table.del('id').then(() => done()), 1000 * 60)

    test('should handle hundreds of simultaneous requests', async (done) => {
        const r = l_.range(0, 100)
        const init = {sum: 0, constant: 'constant'}
        table.overwrite('id', init)

        const r$: Observable<number> = timer(0, 1).pipe(
            take(99)
        )
        const table$: Observable<{ sum: number, constant: string } | undefined> = table.get('id')

        const subOp = combineLatest([r$, table$]).pipe(
            tap(([i, record]) => {
                const [_, patches] = produceWithPatches(record || init,draft => {
                    draft.sum += i
                })
                table.patch('id', patches)
            })
        ).subscribe(v =>
            console.log('.', v)
        )

        const sub = table.get('id').subscribe(value => {
            console.log('--\t', value)

            if (value && value.sum > 100) {
                expect(value && value.constant).toEqual('constant')

                subOp.unsubscribe()
                sub.unsubscribe()
                done()
            }
        })

    }, 1000 * 60 * 5)
})
