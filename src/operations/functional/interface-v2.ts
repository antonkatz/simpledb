import {Observable}       from "rxjs";

export interface OperatorFactory<In, Out, FOut, NeededArgs extends any[], GivenArgs extends any> {
    (
        func: (...args: (NeededArgs & GivenArgs)) => FOut,
        security: (...args: (NeededArgs & GivenArgs)) => Error | undefined,
        // args: (in$: In) => Observable<NeededArgs> | NeededArgs
        args: (in$: In) => NeededArgs, // keep it simple for now
    ): Operator<In, Out, any>
}

export interface PipeOperatorFactory<
    PrevOut, NextOut, PrevContext, NextContext,
    In extends [PrevOut, PrevContext],
    Out extends [NextOut, NextContext],
    PipeArgs extends any[], SetArgs extends any[],

    > extends OperatorFactory<In, Out, any, any, any>{

    (
        func: (...argsPreset: SetArgs) => (...argsInPipe: PipeArgs) => Out,
        // func: (...argsPreset: (SetArgs & ContextArgs)) => Out,
        security: (...args: (PipeArgs & SetArgs)) => Error | undefined,
        // args: (in$: In) => Observable<NeededArgs> | NeededArgs
        args?: (in$: In) => PipeArgs, // keep it simple for now
        contextModifier?: (in$: In, out: NextOut) => NextContext
    ): (...args:SetArgs) => Operator<In, Out, any>
}

export interface SimpleOperatorFactory<
    In, Out,
    ContextArgs extends any[], SetArgs extends any[],

    > extends OperatorFactory<In, Out, any, any, any>{

    (
        func: (argsPreset: SetArgs, ...argsFromContext: ContextArgs) => Out,
        // func: (...argsPreset: (SetArgs & ContextArgs)) => Out,
        security: (...args: (ContextArgs & SetArgs)) => Error | undefined,
        // args: (in$: In) => Observable<NeededArgs> | NeededArgs
        args?: (in$: In) => ContextArgs, // keep it simple for now
    ): (...args:SetArgs) => Operator<In, Out, any>
}

export interface ObservableOperatorFactory<
    In, Out, SetArgs extends any[]
    > extends OperatorFactory<In, Out, any, any, any>{

    (
        func: (...args: SetArgs) => (in$: Observable<In>) => Observable<Out>,
        security: (...args: SetArgs) => Error | undefined,
    ): (...args:SetArgs) => Operator<Observable<In>, Observable<Out>, any>
}

export interface Operator<In, Out, Args extends any[]>
    extends ObservableConstructor<In, Out>,
        SerializableOperator<Operator<In, Out, Args>, Args>
{
    // contextTag: string | undefined // used to tag the result into the context
    // so the pipe starts to look like this [last, {ctx}]

    readonly givenArgs: Args
    readonly prevOp: Operator<any, In | Observable<In>, any> | undefined
    readonly nextOp: Operator<Out | Observable<Out>, any, any> | undefined

    (in$: In): Out

    next<Next>(op: Operator<Out | Observable<Out>, Next, any>): Operator<In, Next, any>
}

export interface PipeOperator<In, Out, Args extends any[]> extends Operator<In, Out, Args> {}

export interface ObservableOperator<In, Out> extends Operator<Observable<In>, Observable<Out>, any>{}

export interface SerializableOperator<Op, Args extends any[]> {
    toJSON(): {operatorId: string, operatorNamespace: 'tasty-scone' | 'rxjs', args: Args}
    fromJSON(raw: any): Op
}

export interface ObservableConstructor<In, Out> {
    asObservable(in$: Observable<In>): Observable<Out>
}

