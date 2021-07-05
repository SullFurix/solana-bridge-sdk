/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
export var VAULT_PREFIX: string;
export var VaultKey: {};
export var VaultState: {};
export var MAX_VAULT_SIZE: number;
export var MAX_EXTERNAL_ACCOUNT_SIZE: number;
export var VAULT_SCHEMA: Map<typeof InitVaultArgs, {
    kind: string;
    fields: (string | typeof ExternalPriceAccount)[][];
}>;
export class Vault {
    constructor(args: any);
    key: any;
    tokenProgram: any;
    fractionMint: any;
    authority: any;
    fractionTreasury: any;
    redeemTreasury: any;
    allowFurtherShareCreation: any;
    pricingLookupAddress: any;
    tokenTypeCount: any;
    state: any;
    lockedPricePerShare: any;
}
export class SafetyDepositBox {
    constructor(args: any);
    key: any;
    vault: any;
    tokenMint: any;
    store: any;
    order: any;
}
export class ExternalPriceAccount {
    constructor(args: any);
    key: any;
    pricePerShare: any;
    priceMint: any;
    allowedToCombine: any;
}
declare class InitVaultArgs {
    constructor(args: any);
    instruction: number;
    allowFurtherShareCreation: any;
}
export function decodeVault(buffer: any): any;
export function decodeSafetyDeposit(buffer: any): any;
export function initVault(allowFurtherShareCreation: any, fractionalMint: any, redeemTreasury: any, fractionalTreasury: any, vault: any, vaultAuthority: any, pricingLookupAddress: any, instructions: any): Promise<void>;
export function getSafetyDepositBox(vault: any, tokenMint: any): Promise<web3_js_1.PublicKey>;
export function addTokenToInactiveVault(amount: any, tokenMint: any, tokenAccount: any, tokenStoreAccount: any, vault: any, vaultAuthority: any, payer: any, transferAuthority: any, instructions: any): Promise<void>;
export function activateVault(numberOfShares: any, vault: any, fractionMint: any, fractionTreasury: any, vaultAuthority: any, instructions: any): Promise<void>;
export function combineVault(vault: any, outstandingShareTokenAccount: any, payingTokenAccount: any, fractionMint: any, fractionTreasury: any, redeemTreasury: any, newVaultAuthority: any, vaultAuthority: any, transferAuthority: any, externalPriceAccount: any, instructions: any): Promise<void>;
export function withdrawTokenFromSafetyDepositBox(amount: any, destination: any, safetyDepositBox: any, storeKey: any, vault: any, fractionMint: any, vaultAuthority: any, instructions: any): Promise<void>;
export function updateExternalPriceAccount(externalPriceAccountKey: any, externalPriceAccount: any, instructions: any): Promise<void>;
import web3_js_1 = require("@solana/web3.js");
export {};
//# sourceMappingURL=vault.d.ts.map