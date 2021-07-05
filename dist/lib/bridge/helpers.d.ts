/// <reference types="node" />
import { PublicKey } from '@solana/web3.js';
import { AssetMeta } from './meta';
export declare const bridgeAuthorityKey: (bridgeId: PublicKey) => Promise<PublicKey>;
export declare const wrappedAssetMintKey: (bridgeId: PublicKey, authority: PublicKey, asset: AssetMeta) => Promise<PublicKey>;
export declare const wrappedAssetMetaKey: (bridgeId: PublicKey, authority: PublicKey, mint: PublicKey) => Promise<PublicKey>;
export declare function padBuffer(b: Buffer, len: number): Buffer;
//# sourceMappingURL=helpers.d.ts.map