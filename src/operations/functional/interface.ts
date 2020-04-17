import {Observable} from "rxjs";

export type OmitOrVoid<T, K> = Exclude<keyof T, keyof K> extends never ? void : Pick<T, Exclude<keyof T, keyof K>>;

type OperatorTypes = "pipe" | "observable"

export interface Operator<In, Out, UnfulfilledContext, SerializedContext>
    extends ObservableConstructor<In, Out>,
        SerializableOperator<Operator<In, Out, UnfulfilledContext, SerializedContext>, SerializedContext> {

    readonly __type: OperatorTypes;

    (in$: In): Out

    addContext<P extends UnfulfilledContext>(ctx: P): Operator<In, Out, OmitOrVoid<UnfulfilledContext, P>, SerializedContext>

    next<Next, AUCtx>(op: Operator<Out, Next, AUCtx, any>): MultiOperator<In, Next, UnfulfilledContext & AUCtx>
}

/*
* A stream is just an operator with context that has a list of operators
* */
export interface MultiOperator<In, Out, UCtx> extends ObservableOperator<In, Out, UCtx, {chain: any[], additive?: any}> {
    readonly __type: "observable"
}

export interface ObservableOperator<In, Out, UnfulfilledContext, SerializedContext>
    extends Operator<Observable<In>, Observable<Out>, UnfulfilledContext, SerializedContext>{
    readonly __type: "observable"
}

export interface PipeOperator<In, Out, UnfulfilledContext, SerializedContext>
    extends Operator<In, Out, UnfulfilledContext, SerializedContext>{
    readonly __type: "pipe"
}

export interface UnfulfilledContext<All, Left> {
    toJSON(): any
    fromJSON(raw: JSON): All

    get: All
    add<P extends Partial<Left>>(ctx: P): UnfulfilledContext<All, OmitOrVoid<Left, P>>
}

export interface SerializableOperator<T, C> {
    toJSON(): {ctx: C, operatorId: string}

    fromJSON(raw: any): T
}

export interface ObservableConstructor<In, Out> {
    asObservable(in$: Observable<In>): Observable<Out>
}

