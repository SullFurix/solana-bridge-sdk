/// <reference types="node" />
import { Account, AccountInfo, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { AccountInfo as TokenAccountInfo, u64 } from '@solana/spl-token';
export interface TokenAccount {
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
    info: TokenAccountInfo;
}
export interface ParsedDataAccount {
    amount: number;
    rawAmount: string;
    parsedAssetAddress: string;
    parsedAccount: any;
    assetDecimals: number;
    assetIcon: any;
    name: string;
    symbol: string;
    sourceAddress: string;
    targetAddress: string;
    amountInUSD: number;
}
export declare const ParsedDataLayout: any;
export declare function approve(instructions: TransactionInstruction[], cleanupInstructions: TransactionInstruction[], account: PublicKey, owner: PublicKey, amount: number | u64, autoRevoke?: boolean, delegate?: PublicKey, existingTransferAuthority?: Account): Account;
//# sourceMappingURL=account.d.ts.map