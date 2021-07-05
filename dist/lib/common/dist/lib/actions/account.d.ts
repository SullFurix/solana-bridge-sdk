/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
export var DEFAULT_TEMP_MEM_SPACE: number;
export function ensureSplAccount(instructions: any, cleanupInstructions: any, toCheck: any, payer: any, amount: any, signers: any): any;
export function createTempMemoryAccount(instructions: any, payer: any, signers: any, owner: any, space?: number): web3_js_1.PublicKey;
export function createUninitializedMint(instructions: any, payer: any, amount: any, signers: any): web3_js_1.PublicKey;
export function createUninitializedAccount(instructions: any, payer: any, amount: any, signers: any): web3_js_1.PublicKey;
export function createAssociatedTokenAccountInstruction(instructions: any, associatedTokenAddress: any, payer: any, walletAddress: any, splTokenMintAddress: any): void;
export function createMint(instructions: any, payer: any, mintRentExempt: any, decimals: any, owner: any, freezeAuthority: any, signers: any): web3_js_1.PublicKey;
export function createTokenAccount(instructions: any, payer: any, accountRentExempt: any, mint: any, owner: any, signers: any): web3_js_1.PublicKey;
export function findOrCreateAccountByMint(payer: any, owner: any, instructions: any, cleanupInstructions: any, accountRentExempt: any, mint: any, signers: any, excluded: any): web3_js_1.PublicKey;
import web3_js_1 = require("@solana/web3.js");
//# sourceMappingURL=account.d.ts.map