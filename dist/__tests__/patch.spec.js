"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
const fp_1 = __importDefault(require("lodash/fp"));
const immer_1 = require("immer");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const table = src_1.buildTable({ name: 'patch' });
describe('Patching', () => {
    afterAll((done) => table.del('id').then(() => done()));
    beforeAll((done) => table.del('id').then(() => done()), 1000 * 60);
    test('should handle hundreds of simultaneous requests', async (done) => {
        const r = fp_1.default.range(0, 100);
        const init = { sum: 0, constant: 'constant' };
        table.overwrite('id', init);
        const r$ = rxjs_1.timer(0, 1).pipe(operators_1.take(99));
        const table$ = table.get('id');
        const subOp = rxjs_1.combineLatest([r$, table$]).pipe(operators_1.tap(([i, record]) => {
            const [_, patches] = immer_1.produceWithPatches(record || init, draft => {
                draft.sum += i;
            });
            table.patch('id', patches);
        })).subscribe(v => console.log('.', v));
        const sub = table.get('id').subscribe(value => {
            console.log('--\t', value);
            if (value && value.sum > 100) {
                expect(value && value.constant).toEqual('constant');
                subOp.unsubscribe();
                sub.unsubscribe();
                done();
            }
        });
    }, 1000 * 60 * 5);
});
