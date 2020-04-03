// @ts-ignore
interface SecureContextValue<T> {
    value: T,
    signature: string
}

export class SecurityError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}