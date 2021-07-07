/// <reference types="node" />
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
export declare const METADATA_PREFIX = "metadata";
export declare const EDITION = "edition";
export declare const MAX_NAME_LENGTH = 32;
export declare const MAX_SYMBOL_LENGTH = 10;
export declare const MAX_URI_LENGTH = 200;
export declare const MAX_METADATA_LEN: number;
export declare const MAX_NAME_SYMBOL_LEN: number;
export declare const MAX_MASTER_EDITION_KEN: number;
export declare enum MetadataKey {
    MetadataV1 = 0,
    NameSymbolTupleV1 = 1,
    EditionV1 = 2,
    MasterEditionV1 = 3
}
export declare enum MetadataCategory {
    Audio = "audio",
    Video = "video",
    Image = "image"
}
export interface IMetadataExtension {
    name: string;
    symbol: string;
    description: string;
    image: string;
    externalUrl: string;
    royalty: number;
    files?: File[];
    category: MetadataCategory;
}
export declare class MasterEdition {
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
    masterMint: PublicKey;
    constructor(args: {
        key: MetadataKey;
        supply: BN;
        maxSupply?: BN;
        masterMint: PublicKey;
    });
}
export declare class Edition {
    key: MetadataKey;
    parent: PublicKey;
    edition: BN;
    constructor(args: {
        key: MetadataKey;
        parent: PublicKey;
        edition: BN;
    });
}
export declare class Metadata {
    key: MetadataKey;
    nonUniqueSpecificUpdateAuthority?: PublicKey;
    mint: PublicKey;
    name: string;
    symbol: string;
    uri: string;
    extended?: IMetadataExtension;
    masterEdition?: PublicKey;
    edition?: PublicKey;
    nameSymbolTuple?: PublicKey;
    constructor(args: {
        nonUniqueSpecificUpdateAuthority?: PublicKey;
        mint: PublicKey;
        name: string;
        symbol: string;
        uri: string;
    });
}
export declare class NameSymbolTuple {
    key: MetadataKey;
    updateAuthority: PublicKey;
    metadata: PublicKey;
    constructor(args: {
        updateAuthority: Buffer;
        metadata: Buffer;
    });
}
export declare const METADATA_SCHEMA: Map<any, any>;
export declare const decodeMetadata: (buffer: Buffer) => Promise<Metadata>;
export declare const decodeEdition: (buffer: Buffer) => Edition;
export declare const decodeMasterEdition: (buffer: Buffer) => MasterEdition;
export declare const decodeNameSymbolTuple: (buffer: Buffer) => NameSymbolTuple;
export declare function transferUpdateAuthority(account: PublicKey, currentUpdateAuthority: PublicKey, newUpdateAuthority: PublicKey, instructions: TransactionInstruction[]): Promise<void>;
export declare function updateMetadata(symbol: string, name: string, uri: string, newNonUniqueSpecificUpdateAuthority: string | undefined, mintKey: PublicKey, updateAuthority: PublicKey, instructions: TransactionInstruction[], metadataAccount?: PublicKey, nameSymbolAccount?: PublicKey): Promise<PublicKey[]>;
export declare function createMetadata(symbol: string, name: string, uri: string, allowDuplicates: boolean, updateAuthority: PublicKey, mintKey: PublicKey, mintAuthorityKey: PublicKey, instructions: TransactionInstruction[], payer: PublicKey): Promise<PublicKey[]>;
export declare function createMasterEdition(name: string, symbol: string, maxSupply: BN | undefined, mintKey: PublicKey, masterMintKey: PublicKey, updateAuthorityKey: PublicKey, mintAuthorityKey: PublicKey, instructions: TransactionInstruction[], payer: PublicKey): Promise<void>;
export declare function mintNewEditionFromMasterEditionViaToken(newMint: PublicKey, tokenMint: PublicKey, newMintAuthority: PublicKey, masterMint: PublicKey, authorizationTokenHoldingAccount: PublicKey, burnAuthority: PublicKey, updateAuthorityOfMaster: PublicKey, instructions: TransactionInstruction[], payer: PublicKey): Promise<void>;
export declare function getNameSymbol(metadata: Metadata): Promise<PublicKey>;
export declare function getEdition(tokenMint: PublicKey): Promise<PublicKey>;
export declare function getMetadata(tokenMint: PublicKey): Promise<PublicKey>;
//# sourceMappingURL=metadata.d.ts.map