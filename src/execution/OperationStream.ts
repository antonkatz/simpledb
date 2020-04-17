import {List}                            from "immutable"
import {Operation, OrEmpty, VoidIfEmpty} from "../operations/Operation"
import {runOp}                           from "./runOp"
import {Observable, Subject} from "rxjs"
import {SecurityError}       from "../security/Security"

export const OperationStreamSymbol = Symbol()

export type SerializedOperationStream = {ctx?: any, chain: any[], __type: string}

export interface OperationStream<In, Out, Context> {
    readonly symbol: Symbol

    readonly chain: List<Operation<any, any, any>>
    // defaultContext?: Partial<Context>

    getContext(): any
    setContext(ctx: Context): OperationStream<In, Out, void>
    withContext<PCtx extends Partial<Context>>(ctx: PCtx): OperationStream<In, Out, Omit<Context, keyof PCtx>>

    run(input: Observable<In>, ctx: Context): Observable<Out>

    add<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>
    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>):
        OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<OtherCtx> & OrEmpty<Context>>>

    serialize(): string
}

export class BasicOperationStream<In, Out, Context> implements OperationStream<In, Out, Context> {
    readonly symbol = OperationStreamSymbol

    innerContext: any = {}

    constructor(readonly chain: List<Operation<any, any, any>> = List(),
        _defaultContext?: {}) {
        if (_defaultContext) {
            this.innerContext = _defaultContext
        }
    }

    getContext(): any {
        return this.innerContext
    }

    setContext(ctx: Context): OperationStream<In, Out, void> {
        return new BasicOperationStream(this.chain, {...this.innerContext, ...ctx})
    }

    withContext<PCtx extends Partial<Context>>(ctx: PCtx): OperationStream<In, Out, Omit<Context, keyof PCtx>> {
        return new BasicOperationStream(this.chain, {...this.innerContext, ...ctx})
    }

    run(input: Observable<In>, ctx?: Partial<Context>): Observable<Out> {
        const fullCtx = {...this.innerContext, ...ctx}

        this.securityCheck(fullCtx)

        const first: Operation<any, any, any> | undefined = this.chain.first()
        if (first) {
            return this.chain.reduce((reduction: Observable<any> | null, op) => {
                const nextReduction = runOp(op, fullCtx, reduction || input)
                if (!nextReduction) {
                    throw new Error(`Operation Stream failed at ${op.constructor.name || op.getOpName()}`)
                }
                return nextReduction

            }, null) as Observable<Out>
        }
        throw new Error("Operation Stream must have at least one operation")
    }

    securityCheck(ctx: Partial<Context>) {
        this.chain.forEach(op => {
            const c = op.security(ctx)
            if (!c) throw new SecurityError(`OperationStream: Security conditions failed in ${op.getOpName()} ` +
                `with additional context ${JSON.stringify(ctx)}`)
        })
    }

    add<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>):
        OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>> {
        return new BasicOperationStream<In, NextOut, VoidIfEmpty<OrEmpty<NextCtx> & OrEmpty<Context>>>(this.chain.push(op), this.innerContext)
    }

    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>):
        OperationStream<In, NextOut, VoidIfEmpty<OrEmpty<OtherCtx> & OrEmpty<Context>>> {
        const thisCtx: Partial<Context> = {...(this.innerContext || {})}
        const otherCtx: Partial<OtherCtx> = {...(otherStream.getContext() || {})}
        const fullCtx: Partial<Context & OtherCtx> = {...thisCtx, ...otherCtx} as Partial<Context & OtherCtx>

        return new BasicOperationStream(
            this.chain.concat(otherStream.chain), fullCtx
        )
    }

    serialize() {
        const obj: SerializedOperationStream = {ctx: this.innerContext, chain: this.chain.toJSON(), __type: 'basicOperationStream'}
        return JSON.stringify(obj)
    }
}

export function buildOpStream<In, Out, Context>
(op: Operation<In, Out, Context>): OperationStream<In, Out, Context>
export function buildOpStream<In, Out, Context, DCtx extends Partial<Context>>
(op: Operation<In, Out, Context>, defaultContext: DCtx): OperationStream<In, Out, OrEmpty<Omit<Context, keyof DCtx>>>

export function buildOpStream<In, Out, Context, DCtx extends Partial<Context>>
(op: Operation<In, Out, Context>, defaultContext?: DCtx): any {
    if (!defaultContext) return new BasicOperationStream<In, Out, Context>(List([op]))

    return new BasicOperationStream<In, Out, OrEmpty<Omit<Context, keyof DCtx>>>
        // @ts-ignore
    (List([op]), defaultContext)
}
