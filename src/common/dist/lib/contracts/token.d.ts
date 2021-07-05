import { Connection, PublicKey, Transaction } from '@solana/web3.js';
export declare const mintNFT: (connection: Connection, wallet: {
    publicKey: PublicKey;
    signTransaction: (tx: Transaction) => Transaction;
}, owner: PublicKey) => Promise<{
    txid: string;
    mint: PublicKey;
    account: PublicKey;
}>;
//# sourceMappingURL=token.d.ts.map