import EventEmitter from 'eventemitter3';
import { Account, PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapter } from '@solana/wallet-base';
import OpenLogin from '@toruslabs/openlogin';
export declare class TorusWalletAdapter extends EventEmitter implements WalletAdapter {
    _provider: OpenLogin | undefined;
    endpoint: string;
    providerUrl: string;
    account: Account | undefined;
    image: string;
    name: string;
    constructor(providerUrl: string, endpoint: string);
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    get publicKey(): PublicKey | null;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map