/// <reference types="node" />
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { AssetMeta } from './meta';
export declare const createLockAssetInstruction: (authorityKey: PublicKey, payer: PublicKey, tokenAccount: PublicKey, mint: PublicKey, amount: BN, targetChain: number, targetAddress: Buffer, asset: AssetMeta, nonce: number) => Promise<{
    ix: TransactionInstruction;
    transferKey: PublicKey;
}>;
//# sourceMappingURL=lock.d.ts.map