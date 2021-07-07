import EventEmitter from 'eventemitter3';
import { PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-base';
declare type PhantomEvent = 'disconnect' | 'connect';
declare type PhantomRequestMethod = 'connect' | 'disconnect' | 'signTransaction' | 'signAllTransactions';
interface PhantomProvider {
    publicKey?: PublicKey;
    isConnected?: boolean;
    autoApprove?: boolean;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<any>;
}
export declare class PhantomWalletAdapter extends EventEmitter implements WalletAdapter {
    _provider: PhantomProvider | undefined;
    _cachedCorrectKey?: PublicKey;
    constructor();
    get connected(): boolean;
    get autoApprove(): boolean;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    get publicKey(): PublicKey | null;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    connect: () => Promise<void>;
    disconnect(): void;
}
export {};
//# sourceMappingURL=index.d.ts.map