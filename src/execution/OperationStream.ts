import {List} from "immutable"
import {Operation, OrEmpty} from "../operations/Operation"
import {runOp} from "./runOp"
import {Observable, Subject} from "rxjs"
import {SecurityError} from "../Security"

export const OperationStreamSymbol = Symbol()

export type SerializedOperationStream = {ctx?: any, chain: any[]}

export interface OperationStream<In, Out, Context> {
    readonly symbol: Symbol

    readonly chain: List<Operation<any, any, any>>
    defaultContext?: Partial<Context>

    setContext(ctx: Context): OperationStream<In, Out, {}>
    run(input: Observable<In>, ctx: Context): Observable<Out>

    add<NextOut, NextCtx>(op: Operation<Out, NextOut, NextCtx>): OperationStream<In, NextOut, NextCtx> // fixme. wrong ctx type?
    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>):
        OperationStream<In, NextOut, OtherCtx & Context>

    serialize(): string
}

export class BasicOperationStream<In, Out, Context> implements OperationStream<In, Out, Context> {
    readonly symbol = OperationStreamSymbol

    defaultContext: Partial<Context> = {}

    constructor(readonly chain: List<Operation<any, any, any>> = List(),
        _defaultContext?: Partial<Context>) {
        if (_defaultContext) {
            this.defaultContext = _defaultContext
        }
    }

    setContext(ctx: Context): this {
        this.defaultContext = {...this.defaultContext, ...ctx}
        return this
    }

    run(input: Observable<In>, ctx?: Partial<Context>): Observable<Out> {
        const fullCtx = {...this.defaultContext, ...ctx}

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
        OperationStream<In, NextOut, Partial<NextCtx & Context> > {
        return new BasicOperationStream(this.chain.push(op), this.defaultContext)
    }

    join<NextOut, OtherCtx>(otherStream: OperationStream<Out, NextOut, OtherCtx>):
        OperationStream<In, NextOut, OtherCtx & Context> {
        const thisCtx: Partial<Context> = {...(this.defaultContext || {})}
        const otherCtx: Partial<OtherCtx> = {...(otherStream.defaultContext || {})}
        const fullCtx: Partial<Context & OtherCtx> = {...thisCtx, ...otherCtx} as Partial<Context & OtherCtx>

        return new BasicOperationStream(
            this.chain.concat(otherStream.chain), fullCtx
        )
    }

    serialize() {
        const obj: SerializedOperationStream = {ctx: this.defaultContext, chain: this.chain.toJSON()}
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
