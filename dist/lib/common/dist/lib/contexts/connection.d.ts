export var __esModule: boolean;
export var ENDPOINTS: {
    name: string;
    endpoint: string;
    ChainId: spl_token_registry_1.ENV;
}[];
export var SequenceType: {};
import spl_token_registry_1 = require("@solana/spl-token-registry");
export function ConnectionProvider({ children }: {
    children?: any;
}): any;
export function useConnection(): any;
export function useSendConnection(): any;
export function useConnectionConfig(): {
    endpoint: any;
    setEndpoint: any;
    env: any;
    tokens: any;
    tokenMap: any;
};
export function useSlippageConfig(): {
    slippage: any;
    setSlippage: any;
};
export function getErrorForTransaction(connection: any, txid: any): Promise<any[]>;
export function sendTransactions(connection: any, wallet: any, instructionSet: any, signersSet: any, sequenceType: any, commitment: string | undefined, successCallback: ((txid: any, ind: any) => void) | undefined, failCallback: ((txid: any, ind: any) => boolean) | undefined, block: any): Promise<any>;
export function sendTransaction(connection: any, wallet: any, instructions: any, signers: any, awaitConfirmation: boolean | undefined, commitment: string | undefined, includesFeePayer: boolean | undefined, block: any): Promise<{
    txid: any;
    slot: number;
}>;
export function sendTransactionWithRetry(connection: any, wallet: any, instructions: any, signers: any, commitment: string | undefined, includesFeePayer: boolean | undefined, block: any, beforeSend: any): Promise<{
    txid: any;
    slot: number;
}>;
export function getUnixTs(): number;
export function sendSignedTransaction({ signedTransaction, connection, timeout, }: {
    signedTransaction: any;
    connection: any;
    timeout?: number | undefined;
}): Promise<{
    txid: any;
    slot: number;
}>;
//# sourceMappingURL=connection.d.ts.map