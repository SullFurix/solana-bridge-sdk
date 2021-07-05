export var __esModule: boolean;
export class SendTransactionError extends Error {
    constructor(message: any, txId: any, txError: any);
    txError: any;
    txId: any;
}
export function isSendTransactionError(error: any): boolean;
export class SignTransactionError extends Error {
    constructor(message: any);
}
export function isSignTransactionError(error: any): boolean;
//# sourceMappingURL=errors.d.ts.map