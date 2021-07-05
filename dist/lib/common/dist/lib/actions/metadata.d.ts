/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
export var METADATA_PREFIX: string;
export var EDITION: string;
export var MAX_NAME_LENGTH: number;
export var MAX_SYMBOL_LENGTH: number;
export var MAX_URI_LENGTH: number;
export var MAX_METADATA_LEN: number;
export var MAX_NAME_SYMBOL_LEN: number;
export var MAX_MASTER_EDITION_KEN: number;
export var MetadataKey: {};
export var MetadataCategory: {};
export var METADATA_SCHEMA: Map<typeof TransferUpdateAuthorityArgs, {
    kind: string;
    fields: (string | {
        kind: string;
        type: string;
    })[][];
}>;
export class MasterEdition {
    constructor(args: any);
    key: any;
    supply: any;
    maxSupply: any;
    masterMint: any;
}
export class Edition {
    constructor(args: any);
    key: any;
    parent: any;
    edition: any;
}
export class Metadata {
    constructor(args: any);
    key: any;
    nonUniqueSpecificUpdateAuthority: any;
    mint: any;
    name: any;
    symbol: any;
    uri: any;
}
export class NameSymbolTuple {
    constructor(args: any);
    key: any;
    updateAuthority: web3_js_1.PublicKey;
    metadata: web3_js_1.PublicKey;
}
declare class TransferUpdateAuthorityArgs {
    instruction: number;
}
export function decodeMetadata(buffer: any): Promise<any>;
export function decodeEdition(buffer: any): any;
export function decodeMasterEdition(buffer: any): any;
export function decodeNameSymbolTuple(buffer: any): any;
export function transferUpdateAuthority(account: any, currentUpdateAuthority: any, newUpdateAuthority: any, instructions: any): Promise<void>;
export function updateMetadata(symbol: any, name: any, uri: any, newNonUniqueSpecificUpdateAuthority: any, mintKey: any, updateAuthority: any, instructions: any, metadataAccount: any, nameSymbolAccount: any): Promise<any[]>;
export function createMetadata(symbol: any, name: any, uri: any, allowDuplicates: any, updateAuthority: any, mintKey: any, mintAuthorityKey: any, instructions: any, payer: any): Promise<web3_js_1.PublicKey[]>;
export function createMasterEdition(name: any, symbol: any, maxSupply: any, mintKey: any, masterMintKey: any, updateAuthorityKey: any, mintAuthorityKey: any, instructions: any, payer: any): Promise<void>;
export function mintNewEditionFromMasterEditionViaToken(newMint: any, tokenMint: any, newMintAuthority: any, masterMint: any, authorizationTokenHoldingAccount: any, burnAuthority: any, updateAuthorityOfMaster: any, instructions: any, payer: any): Promise<void>;
export function getNameSymbol(metadata: any): Promise<web3_js_1.PublicKey>;
export function getEdition(tokenMint: any): Promise<web3_js_1.PublicKey>;
export function getMetadata(tokenMint: any): Promise<web3_js_1.PublicKey>;
import web3_js_1 = require("@solana/web3.js");
export {};
//# sourceMappingURL=metadata.d.ts.map