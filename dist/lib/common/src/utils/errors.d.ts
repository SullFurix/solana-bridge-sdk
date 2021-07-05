import { TransactionError } from '@solana/web3.js';
export declare class SendTransactionError extends Error {
    txError: TransactionError;
    txId: string;
    constructor(message: string, txId: string, txError: TransactionError);
}
export declare function isSendTransactionError(error: any): error is SendTransactionError;
export declare class SignTransactionError extends Error {
    constructor(message: string);
}
export declare function isSignTransactionError(error: any): error is SignTransactionError;
//# sourceMappingURL=errors.d.ts.map