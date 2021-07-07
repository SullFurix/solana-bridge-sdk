import EventEmitter from 'eventemitter3';
import { PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-base';
export declare class SolongWalletAdapter extends EventEmitter implements WalletAdapter {
    _publicKey: PublicKey | null;
    _onProcess: boolean;
    constructor();
    get publicKey(): PublicKey | null;
    signTransaction(transaction: Transaction): Promise<any>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    connect(): void;
    disconnect(): void;
}
//# sourceMappingURL=index.d.ts.map