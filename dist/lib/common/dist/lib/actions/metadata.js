"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = exports.getEdition = exports.getNameSymbol = exports.mintNewEditionFromMasterEditionViaToken = exports.createMasterEdition = exports.createMetadata = exports.updateMetadata = exports.transferUpdateAuthority = exports.decodeNameSymbolTuple = exports.decodeMasterEdition = exports.decodeEdition = exports.decodeMetadata = exports.METADATA_SCHEMA = exports.NameSymbolTuple = exports.Metadata = exports.Edition = exports.MasterEdition = exports.MetadataCategory = exports.MetadataKey = exports.MAX_MASTER_EDITION_KEN = exports.MAX_NAME_SYMBOL_LEN = exports.MAX_METADATA_LEN = exports.MAX_URI_LENGTH = exports.MAX_SYMBOL_LENGTH = exports.MAX_NAME_LENGTH = exports.EDITION = exports.METADATA_PREFIX = void 0;
const web3_js_1 = require("@solana/web3.js");
const ids_1 = require("../utils/ids");
const borsh_1 = require("./../utils/borsh");
const borsh_2 = require("borsh");
exports.METADATA_PREFIX = 'metadata';
exports.EDITION = 'edition';
exports.MAX_NAME_LENGTH = 32;
exports.MAX_SYMBOL_LENGTH = 10;
exports.MAX_URI_LENGTH = 200;
exports.MAX_METADATA_LEN = 1 + 32 + exports.MAX_NAME_LENGTH + exports.MAX_SYMBOL_LENGTH + exports.MAX_URI_LENGTH + 200;
exports.MAX_NAME_SYMBOL_LEN = 1 + 32 + 8;
exports.MAX_MASTER_EDITION_KEN = 1 + 9 + 8 + 32;
var MetadataKey;
(function (MetadataKey) {
    MetadataKey[MetadataKey["MetadataV1"] = 0] = "MetadataV1";
    MetadataKey[MetadataKey["NameSymbolTupleV1"] = 1] = "NameSymbolTupleV1";
    MetadataKey[MetadataKey["EditionV1"] = 2] = "EditionV1";
    MetadataKey[MetadataKey["MasterEditionV1"] = 3] = "MasterEditionV1";
})(MetadataKey = exports.MetadataKey || (exports.MetadataKey = {}));
var MetadataCategory;
(function (MetadataCategory) {
    MetadataCategory["Audio"] = "audio";
    MetadataCategory["Video"] = "video";
    MetadataCategory["Image"] = "image";
})(MetadataCategory = exports.MetadataCategory || (exports.MetadataCategory = {}));
class MasterEdition {
    constructor(args) {
        this.key = MetadataKey.MasterEditionV1;
        this.supply = args.supply;
        this.maxSupply = args.maxSupply;
        this.masterMint = args.masterMint;
    }
}
exports.MasterEdition = MasterEdition;
class Edition {
    constructor(args) {
        this.key = MetadataKey.EditionV1;
        this.parent = args.parent;
        this.edition = args.edition;
    }
}
exports.Edition = Edition;
class Metadata {
    constructor(args) {
        this.key = MetadataKey.MetadataV1;
        this.nonUniqueSpecificUpdateAuthority =
            args.nonUniqueSpecificUpdateAuthority;
        this.mint = args.mint;
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
    }
}
exports.Metadata = Metadata;
class NameSymbolTuple {
    constructor(args) {
        this.key = MetadataKey.NameSymbolTupleV1;
        this.updateAuthority = new web3_js_1.PublicKey(args.updateAuthority);
        this.metadata = new web3_js_1.PublicKey(args.metadata);
    }
}
exports.NameSymbolTuple = NameSymbolTuple;
class CreateMetadataArgs {
    constructor(args) {
        this.instruction = 0;
        this.allowDuplicates = false;
        this.name = args.name;
        this.symbol = args.symbol;
        this.uri = args.uri;
        this.allowDuplicates = !!args.allowDuplicates;
    }
}
class UpdateMetadataArgs {
    constructor(args) {
        this.instruction = 1;
        this.uri = args.uri;
        this.nonUniqueSpecificUpdateAuthority = args.nonUniqueSpecificUpdateAuthority
            ? new web3_js_1.PublicKey(args.nonUniqueSpecificUpdateAuthority)
            : null;
    }
}
class TransferUpdateAuthorityArgs {
    constructor() {
        this.instruction = 2;
    }
}
class CreateMasterEditionArgs {
    constructor(args) {
        this.instruction = 3;
        this.maxSupply = args.maxSupply;
    }
}
exports.METADATA_SCHEMA = new Map([
    [
        CreateMetadataArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['allowDuplicates', 'u8'],
                ['name', 'string'],
                ['symbol', 'string'],
                ['uri', 'string'],
            ],
        },
    ],
    [
        UpdateMetadataArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['uri', 'string'],
                [
                    'nonUniqueSpecificUpdateAuthority',
                    { kind: 'option', type: 'pubkey' },
                ],
            ],
        },
    ],
    [
        TransferUpdateAuthorityArgs,
        {
            kind: 'struct',
            fields: [['instruction', 'u8']],
        },
    ],
    [
        CreateMasterEditionArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['maxSupply', { kind: 'option', type: 'u64' }],
            ],
        },
    ],
    [
        MasterEdition,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                ['supply', 'u64'],
                ['maxSupply', { kind: 'option', type: 'u64' }],
                ['masterMint', 'pubkey'],
            ],
        },
    ],
    [
        Edition,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                ['parent', 'pubkey'],
                ['edition', 'u64'],
            ],
        },
    ],
    [
        Metadata,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                [
                    'nonUniqueSpecificUpdateAuthority',
                    { kind: 'option', type: 'pubkey' },
                ],
                ['mint', 'pubkey'],
                ['name', 'string'],
                ['symbol', 'string'],
                ['uri', 'string'],
            ],
        },
    ],
    [
        NameSymbolTuple,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                ['updateAuthority', 'pubkey'],
                ['metadata', 'pubkey'],
            ],
        },
    ],
]);
const decodeMetadata = async (buffer) => {
    const metadata = borsh_1.deserializeBorsh(exports.METADATA_SCHEMA, Metadata, buffer);
    metadata.nameSymbolTuple = await getNameSymbol(metadata);
    metadata.edition = await getEdition(metadata.mint);
    metadata.masterEdition = await getEdition(metadata.mint);
    return metadata;
};
exports.decodeMetadata = decodeMetadata;
const decodeEdition = (buffer) => {
    return borsh_1.deserializeBorsh(exports.METADATA_SCHEMA, Edition, buffer);
};
exports.decodeEdition = decodeEdition;
const decodeMasterEdition = (buffer) => {
    return borsh_1.deserializeBorsh(exports.METADATA_SCHEMA, MasterEdition, buffer);
};
exports.decodeMasterEdition = decodeMasterEdition;
const decodeNameSymbolTuple = (buffer) => {
    return borsh_1.deserializeBorsh(exports.METADATA_SCHEMA, NameSymbolTuple, buffer);
};
exports.decodeNameSymbolTuple = decodeNameSymbolTuple;
async function transferUpdateAuthority(account, currentUpdateAuthority, newUpdateAuthority, instructions) {
    const metadataProgramId = ids_1.programIds().metadata;
    const data = Buffer.from(borsh_2.serialize(exports.METADATA_SCHEMA, new TransferUpdateAuthorityArgs()));
    const keys = [
        {
            pubkey: account,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: currentUpdateAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: newUpdateAuthority,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: metadataProgramId,
        data: data,
    }));
}
exports.transferUpdateAuthority = transferUpdateAuthority;
async function updateMetadata(symbol, name, uri, newNonUniqueSpecificUpdateAuthority, mintKey, updateAuthority, instructions, metadataAccount, nameSymbolAccount) {
    const metadataProgramId = ids_1.programIds().metadata;
    metadataAccount =
        metadataAccount ||
            (await web3_js_1.PublicKey.findProgramAddress([
                Buffer.from('metadata'),
                metadataProgramId.toBuffer(),
                mintKey.toBuffer(),
            ], metadataProgramId))[0];
    nameSymbolAccount =
        nameSymbolAccount ||
            (await web3_js_1.PublicKey.findProgramAddress([
                Buffer.from('metadata'),
                metadataProgramId.toBuffer(),
                Buffer.from(name),
                Buffer.from(symbol),
            ], metadataProgramId))[0];
    const value = new UpdateMetadataArgs({
        uri,
        nonUniqueSpecificUpdateAuthority: !newNonUniqueSpecificUpdateAuthority
            ? undefined
            : newNonUniqueSpecificUpdateAuthority,
    });
    const data = Buffer.from(borsh_2.serialize(exports.METADATA_SCHEMA, value));
    const keys = [
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: updateAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: nameSymbolAccount,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: metadataProgramId,
        data,
    }));
    return [metadataAccount, nameSymbolAccount];
}
exports.updateMetadata = updateMetadata;
async function createMetadata(symbol, name, uri, allowDuplicates, updateAuthority, mintKey, mintAuthorityKey, instructions, payer) {
    const metadataProgramId = ids_1.programIds().metadata;
    const metadataAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from('metadata'),
        metadataProgramId.toBuffer(),
        mintKey.toBuffer(),
    ], metadataProgramId))[0];
    const nameSymbolAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from('metadata'),
        metadataProgramId.toBuffer(),
        Buffer.from(name),
        Buffer.from(symbol),
    ], metadataProgramId))[0];
    const value = new CreateMetadataArgs({ name, symbol, uri, allowDuplicates });
    const data = Buffer.from(borsh_2.serialize(exports.METADATA_SCHEMA, value));
    const keys = [
        {
            pubkey: nameSymbolAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: mintKey,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: mintAuthorityKey,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: updateAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: metadataProgramId,
        data,
    }));
    return [metadataAccount, nameSymbolAccount];
}
exports.createMetadata = createMetadata;
async function createMasterEdition(name, symbol, maxSupply, mintKey, masterMintKey, updateAuthorityKey, mintAuthorityKey, instructions, payer) {
    const metadataProgramId = ids_1.programIds().metadata;
    const metadataAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        metadataProgramId.toBuffer(),
        mintKey.toBuffer(),
    ], metadataProgramId))[0];
    const nameSymbolAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        metadataProgramId.toBuffer(),
        Buffer.from(name),
        Buffer.from(symbol),
    ], metadataProgramId))[0];
    const editionAccount = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        metadataProgramId.toBuffer(),
        mintKey.toBuffer(),
        Buffer.from(exports.EDITION),
    ], metadataProgramId))[0];
    const value = new CreateMasterEditionArgs({ maxSupply: maxSupply || null });
    const data = Buffer.from(borsh_2.serialize(exports.METADATA_SCHEMA, value));
    const keys = [
        {
            pubkey: editionAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: mintKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: masterMintKey,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: updateAuthorityKey,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: mintAuthorityKey,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: metadataAccount,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: nameSymbolAccount,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: ids_1.programIds().token,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: metadataProgramId,
        data,
    }));
}
exports.createMasterEdition = createMasterEdition;
async function mintNewEditionFromMasterEditionViaToken(newMint, tokenMint, newMintAuthority, masterMint, authorizationTokenHoldingAccount, burnAuthority, updateAuthorityOfMaster, instructions, payer) {
    const metadataProgramId = ids_1.programIds().metadata;
    const newMetadataKey = await getMetadata(newMint);
    const masterMetadataKey = await getMetadata(tokenMint);
    const newEdition = await getEdition(newMint);
    const masterEdition = await getEdition(tokenMint);
    const data = Buffer.from([5]);
    const keys = [
        {
            pubkey: newMetadataKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: newEdition,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: masterEdition,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: newMint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: newMintAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: masterMint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: authorizationTokenHoldingAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: burnAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: updateAuthorityOfMaster,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: masterMetadataKey,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: ids_1.programIds().token,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: metadataProgramId,
        data,
    }));
}
exports.mintNewEditionFromMasterEditionViaToken = mintNewEditionFromMasterEditionViaToken;
async function getNameSymbol(metadata) {
    const PROGRAM_IDS = ids_1.programIds();
    return (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        PROGRAM_IDS.metadata.toBuffer(),
        metadata.mint.toBuffer(),
        Buffer.from(metadata.name),
        Buffer.from(metadata.symbol),
    ], PROGRAM_IDS.metadata))[0];
}
exports.getNameSymbol = getNameSymbol;
async function getEdition(tokenMint) {
    const PROGRAM_IDS = ids_1.programIds();
    return (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        PROGRAM_IDS.metadata.toBuffer(),
        tokenMint.toBuffer(),
        Buffer.from(exports.EDITION),
    ], PROGRAM_IDS.metadata))[0];
}
exports.getEdition = getEdition;
async function getMetadata(tokenMint) {
    const PROGRAM_IDS = ids_1.programIds();
    return (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.METADATA_PREFIX),
        PROGRAM_IDS.metadata.toBuffer(),
        tokenMint.toBuffer(),
    ], PROGRAM_IDS.metadata))[0];
}
exports.getMetadata = getMetadata;
//# sourceMappingURL=metadata.js.map