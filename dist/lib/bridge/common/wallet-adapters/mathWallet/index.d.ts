import EventEmitter from 'eventemitter3';
import { PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-base';
export declare class MathWalletAdapter extends EventEmitter implements WalletAdapter {
    _publicKey: PublicKey | null;
    _onProcess: boolean;
    _connected: boolean;
    constructor();
    get publicKey(): PublicKey | null;
    get connected(): boolean;
    get autoApprove(): boolean;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    private get _provider();
    signTransaction(transaction: Transaction): any;
    connect(): void;
    disconnect(): void;
}
//# sourceMappingURL=index.d.ts.map