/// <reference types="node" />
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
export interface AssetMeta {
    chain: number;
    decimals: number;
    address: Buffer;
}
export declare const WrappedMetaLayout: typeof BufferLayout.Structure;
export declare const createWrappedLayout: any;
export declare const createWrappedAssetInstruction: (meta: AssetMeta, bridgeId: PublicKey, authorityKey: PublicKey, mintKey: PublicKey, payer: PublicKey) => Promise<TransactionInstruction>;
//# sourceMappingURL=meta.d.ts.map