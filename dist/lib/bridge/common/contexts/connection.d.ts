/// <reference types="react" />
import { Account, BlockhashAndFeeCalculator, Commitment, Connection, Transaction, TransactionInstruction } from '@solana/web3.js';
import { TokenInfo, ENV as ChainId } from '@solana/spl-token-registry';
export declare type ENV = 'mainnet-beta (Serum)' | 'mainnet-beta' | 'mainnet-beta (Serum)' | 'testnet' | 'devnet' | 'localnet' | 'lending';
export declare const ENDPOINTS: {
    name: ENV;
    endpoint: string;
    ChainId: ChainId;
}[];
export declare function ConnectionProvider({ children }: {
    children?: any;
}): JSX.Element;
export declare function useConnection(): Connection;
export declare function useSendConnection(): Connection;
export declare function useConnectionConfig(): {
    endpoint: string;
    setEndpoint: (val: string) => void;
    env: ENV;
    tokens: TokenInfo[];
    tokenMap: Map<string, TokenInfo>;
};
export declare function useSlippageConfig(): {
    slippage: number;
    setSlippage: (val: number) => void;
};
export declare const getErrorForTransaction: (connection: Connection, txid: string) => Promise<string[]>;
export declare enum SequenceType {
    Sequential = 0,
    Parallel = 1,
    StopOnFailure = 2
}
export declare const sendTransactions: (connection: Connection, wallet: any, instructionSet: TransactionInstruction[][], signersSet: Account[][], sequenceType?: SequenceType, commitment?: Commitment, successCallback?: (txid: string, ind: number) => void, failCallback?: (reason: string, ind: number) => boolean, block?: BlockhashAndFeeCalculator | undefined) => Promise<number>;
export declare const sendTransaction: (connection: Connection, wallet: any, instructions: TransactionInstruction[], signers: Account[], awaitConfirmation?: boolean, commitment?: Commitment, includesFeePayer?: boolean, block?: BlockhashAndFeeCalculator | undefined) => Promise<{
    txid: string;
    slot: number;
}>;
export declare const sendTransactionWithRetry: (connection: Connection, wallet: any, instructions: TransactionInstruction[], signers: Account[], commitment?: Commitment, includesFeePayer?: boolean, block?: BlockhashAndFeeCalculator | undefined, beforeSend?: (() => void) | undefined) => Promise<{
    txid: string;
    slot: number;
}>;
export declare const getUnixTs: () => number;
export declare function sendSignedTransaction({ signedTransaction, connection, timeout, }: {
    signedTransaction: Transaction;
    connection: Connection;
    sendingMessage?: string;
    sentMessage?: string;
    successMessage?: string;
    timeout?: number;
}): Promise<{
    txid: string;
    slot: number;
}>;
//# sourceMappingURL=connection.d.ts.map