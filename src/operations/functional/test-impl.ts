// @ts-nocheck

import {ObservableOperatorFactory, Operator} from "./interface-v2";
import {Observable}                          from "rxjs";


const buildObservableOperator: ObservableOperatorFactory<any, any, any> =
    function<In, Out, SetArgs extends any[]>(
        func: (...args: SetArgs) => (in$: Observable<In>) => Observable<Out>,
        security = (...args: SetArgs): (Error | undefined) => {return undefined}) {


        return (...args: SetArgs) => {
            const presetFunc = func(...args)

                const operatorDraft = (in$: Observable<In>) => {
                    return presetFunc(in$)
                }
                operatorDraft.givenArgs = args
                operatorDraft.nextOp = undefined
                operatorDraft.prevOp = undefined


                const operator: Operator<Observable<In>, Observable<Out>, any> = operatorDraft


                return operator
            }
    }
