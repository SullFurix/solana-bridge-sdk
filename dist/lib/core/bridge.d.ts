/// <reference types="node" />
import * as solanaWeb3 from '@solana/web3.js';
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { AssetMeta } from '../bridge';
export declare enum LockupStatus {
    AWAITING_VAA = 0,
    UNCLAIMED_VAA = 1,
    COMPLETED = 2
}
export interface LockupWithStatus extends Lockup {
    status: LockupStatus;
}
export interface Lockup {
    lockupAddress: PublicKey;
    amount: BN;
    toChain: number;
    sourceAddress: PublicKey;
    targetAddress: Uint8Array;
    assetAddress: Uint8Array;
    assetChain: number;
    assetDecimals: number;
    nonce: number;
    vaa: Uint8Array;
    vaaTime: number;
    pokeCounter: number;
    signatureAccount: PublicKey;
    initialized: boolean;
}
export interface Signature {
    signature: number[];
    index: number;
}
export declare const CHAIN_ID_SOLANA = 1;
declare class SolanaBridge {
    endpoint: string;
    connection: solanaWeb3.Connection;
    programID: PublicKey;
    tokenProgram: PublicKey;
    constructor(endpoint: string, connection: solanaWeb3.Connection, programID: PublicKey, tokenProgram: PublicKey);
    createPokeProposalInstruction(proposalAccount: PublicKey): TransactionInstruction;
    fetchAssetMeta(mint: PublicKey): Promise<AssetMeta>;
    fetchSignatureStatus(signatureStatus: PublicKey): Promise<Signature[]>;
    parseLockup(address: PublicKey, data: Buffer): Lockup;
    fetchTransferProposals(tokenAccount: PublicKey): Promise<Lockup[]>;
    AccountLayout: any;
    getConfigKey(): Promise<PublicKey>;
}
export declare class u64 extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): Buffer;
    /**
     * Construct a u64 from Buffer representation
     */
    static fromBuffer(buffer: Buffer): u64;
}
export declare class u256 extends BN {
    /**
     * Convert to Buffer representation
     */
    toBuffer(): Buffer;
    /**
     * Construct a u256 from Buffer representation
     */
    static fromBuffer(buffer: number[]): u256;
}
/**
 * Layout for a public key
 */
export declare const publicKey: (property?: string) => Object;
/**
 * Layout for a 64bit unsigned value
 */
export declare const uint64: (property?: string) => Object;
/**
 * Layout for a 256-bit unsigned value
 */
export declare const uint256: (property?: string) => Object;
/**
 * Layout for a Rust String type
 */
export declare const rustString: (property?: string) => any;
export { SolanaBridge };
//# sourceMappingURL=bridge.d.ts.map