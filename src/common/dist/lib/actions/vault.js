"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateExternalPriceAccount = exports.withdrawTokenFromSafetyDepositBox = exports.combineVault = exports.activateVault = exports.addTokenToInactiveVault = exports.getSafetyDepositBox = exports.initVault = exports.decodeSafetyDeposit = exports.decodeVault = exports.VAULT_SCHEMA = exports.ExternalPriceAccount = exports.SafetyDepositBox = exports.Vault = exports.MAX_EXTERNAL_ACCOUNT_SIZE = exports.MAX_VAULT_SIZE = exports.VaultState = exports.VaultKey = exports.VAULT_PREFIX = void 0;
const web3_js_1 = require("@solana/web3.js");
const ids_1 = require("../utils/ids");
const borsh_1 = require("./../utils/borsh");
const borsh_2 = require("borsh");
exports.VAULT_PREFIX = 'vault';
var VaultKey;
(function (VaultKey) {
    VaultKey[VaultKey["VaultV1"] = 0] = "VaultV1";
    VaultKey[VaultKey["SafetyDepositBoxV1"] = 1] = "SafetyDepositBoxV1";
    VaultKey[VaultKey["ExternalPriceAccountV1"] = 2] = "ExternalPriceAccountV1";
})(VaultKey = exports.VaultKey || (exports.VaultKey = {}));
var VaultState;
(function (VaultState) {
    VaultState[VaultState["Inactive"] = 0] = "Inactive";
    VaultState[VaultState["Active"] = 1] = "Active";
    VaultState[VaultState["Combined"] = 2] = "Combined";
    VaultState[VaultState["Deactivated"] = 3] = "Deactivated";
})(VaultState = exports.VaultState || (exports.VaultState = {}));
exports.MAX_VAULT_SIZE = 1 + 32 + 32 + 32 + 32 + 1 + 32 + 1 + 32 + 1 + 1 + 8;
exports.MAX_EXTERNAL_ACCOUNT_SIZE = 1 + 8 + 32 + 1;
class Vault {
    constructor(args) {
        this.key = VaultKey.VaultV1;
        this.tokenProgram = args.tokenProgram;
        this.fractionMint = args.fractionMint;
        this.authority = args.authority;
        this.fractionTreasury = args.fractionTreasury;
        this.redeemTreasury = args.redeemTreasury;
        this.allowFurtherShareCreation = args.allowFurtherShareCreation;
        this.pricingLookupAddress = args.pricingLookupAddress;
        this.tokenTypeCount = args.tokenTypeCount;
        this.state = args.state;
        this.lockedPricePerShare = args.lockedPricePerShare;
    }
}
exports.Vault = Vault;
class SafetyDepositBox {
    constructor(args) {
        this.key = VaultKey.SafetyDepositBoxV1;
        this.vault = args.vault;
        this.tokenMint = args.tokenMint;
        this.store = args.store;
        this.order = args.order;
    }
}
exports.SafetyDepositBox = SafetyDepositBox;
class ExternalPriceAccount {
    constructor(args) {
        this.key = VaultKey.ExternalPriceAccountV1;
        this.pricePerShare = args.pricePerShare;
        this.priceMint = args.priceMint;
        this.allowedToCombine = args.allowedToCombine;
    }
}
exports.ExternalPriceAccount = ExternalPriceAccount;
class InitVaultArgs {
    constructor(args) {
        this.instruction = 0;
        this.allowFurtherShareCreation = false;
        this.allowFurtherShareCreation = args.allowFurtherShareCreation;
    }
}
class AmountArgs {
    constructor(args) {
        this.instruction = args.instruction;
        this.amount = args.amount;
    }
}
class NumberOfShareArgs {
    constructor(args) {
        this.instruction = args.instruction;
        this.numberOfShares = args.numberOfShares;
    }
}
class UpdateExternalPriceAccountArgs {
    constructor(args) {
        this.instruction = 9;
        this.externalPriceAccount = args.externalPriceAccount;
    }
}
exports.VAULT_SCHEMA = new Map([
    [
        InitVaultArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['allowFurtherShareCreation', 'u8'],
            ],
        },
    ],
    [
        AmountArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['amount', 'u64'],
            ],
        },
    ],
    [
        NumberOfShareArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['numberOfShares', 'u64'],
            ],
        },
    ],
    [
        UpdateExternalPriceAccountArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['externalPriceAccount', ExternalPriceAccount],
            ],
        },
    ],
    [
        Vault,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                ['tokenProgram', 'pubkey'],
                ['fractionMint', 'pubkey'],
                ['authority', 'pubkey'],
                ['fractionTreasury', 'pubkey'],
                ['redeemTreasury', 'pubkey'],
                ['allowFurtherShareCreation', 'u8'],
                ['pricingLookupAddress', 'u8'],
                ['tokenTypeCount', 'u8'],
                ['state', 'u8'],
                ['lockedPricePerShare', 'u64'],
            ],
        },
    ],
    [
        SafetyDepositBox,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                ['vault', 'pubkey'],
                ['tokenMint', 'pubkey'],
                ['store', 'pubkey'],
                ['order', 'u8'],
            ],
        },
    ],
    [
        ExternalPriceAccount,
        {
            kind: 'struct',
            fields: [
                ['key', 'u8'],
                ['pricePerShare', 'u64'],
                ['priceMint', 'pubkey'],
                ['allowedToCombine', 'u8'],
            ],
        },
    ],
]);
const decodeVault = (buffer) => {
    return borsh_1.deserializeBorsh(exports.VAULT_SCHEMA, Vault, buffer);
};
exports.decodeVault = decodeVault;
const decodeSafetyDeposit = (buffer) => {
    return borsh_1.deserializeBorsh(exports.VAULT_SCHEMA, SafetyDepositBox, buffer);
};
exports.decodeSafetyDeposit = decodeSafetyDeposit;
async function initVault(allowFurtherShareCreation, fractionalMint, redeemTreasury, fractionalTreasury, vault, vaultAuthority, pricingLookupAddress, instructions) {
    const vaultProgramId = ids_1.programIds().vault;
    const data = Buffer.from(borsh_2.serialize(exports.VAULT_SCHEMA, new InitVaultArgs({ allowFurtherShareCreation })));
    const keys = [
        {
            pubkey: fractionalMint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: redeemTreasury,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: fractionalTreasury,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: vault,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: vaultAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: pricingLookupAddress,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: ids_1.programIds().token,
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
        programId: vaultProgramId,
        data: data,
    }));
}
exports.initVault = initVault;
async function getSafetyDepositBox(vault, tokenMint) {
    const vaultProgramId = ids_1.programIds().vault;
    return (await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.VAULT_PREFIX), vault.toBuffer(), tokenMint.toBuffer()], vaultProgramId))[0];
}
exports.getSafetyDepositBox = getSafetyDepositBox;
async function addTokenToInactiveVault(amount, tokenMint, tokenAccount, tokenStoreAccount, vault, vaultAuthority, payer, transferAuthority, instructions) {
    const vaultProgramId = ids_1.programIds().vault;
    const safetyDepositBox = await getSafetyDepositBox(vault, tokenMint);
    const value = new AmountArgs({
        instruction: 1,
        amount,
    });
    const data = Buffer.from(borsh_2.serialize(exports.VAULT_SCHEMA, value));
    const keys = [
        {
            pubkey: safetyDepositBox,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: tokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: tokenStoreAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: vault,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: vaultAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: transferAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: ids_1.programIds().token,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: vaultProgramId,
        data,
    }));
}
exports.addTokenToInactiveVault = addTokenToInactiveVault;
async function activateVault(numberOfShares, vault, fractionMint, fractionTreasury, vaultAuthority, instructions) {
    const vaultProgramId = ids_1.programIds().vault;
    const fractionMintAuthority = (await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.VAULT_PREFIX), vaultProgramId.toBuffer()], vaultProgramId))[0];
    const value = new NumberOfShareArgs({ instruction: 2, numberOfShares });
    const data = Buffer.from(borsh_2.serialize(exports.VAULT_SCHEMA, value));
    const keys = [
        {
            pubkey: vault,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: fractionMint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: fractionTreasury,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: fractionMintAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: vaultAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: ids_1.programIds().token,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: vaultProgramId,
        data,
    }));
}
exports.activateVault = activateVault;
async function combineVault(vault, outstandingShareTokenAccount, payingTokenAccount, fractionMint, fractionTreasury, redeemTreasury, newVaultAuthority, vaultAuthority, transferAuthority, externalPriceAccount, instructions) {
    const vaultProgramId = ids_1.programIds().vault;
    const burnAuthority = (await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.VAULT_PREFIX), vaultProgramId.toBuffer()], vaultProgramId))[0];
    const data = Buffer.from([3]);
    const keys = [
        {
            pubkey: vault,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: outstandingShareTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: payingTokenAccount,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: fractionMint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: fractionTreasury,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: redeemTreasury,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: newVaultAuthority || vaultAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: vaultAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: transferAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: burnAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: externalPriceAccount,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: ids_1.programIds().token,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: vaultProgramId,
        data,
    }));
}
exports.combineVault = combineVault;
async function withdrawTokenFromSafetyDepositBox(amount, destination, safetyDepositBox, storeKey, vault, fractionMint, vaultAuthority, instructions) {
    const vaultProgramId = ids_1.programIds().vault;
    const transferAuthority = (await web3_js_1.PublicKey.findProgramAddress([Buffer.from(exports.VAULT_PREFIX), vaultProgramId.toBuffer()], vaultProgramId))[0];
    const value = new AmountArgs({ instruction: 5, amount });
    const data = Buffer.from(borsh_2.serialize(exports.VAULT_SCHEMA, value));
    const keys = [
        {
            pubkey: destination,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: safetyDepositBox,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: storeKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: vault,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: fractionMint,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: vaultAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: transferAuthority,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: ids_1.programIds().token,
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
        programId: vaultProgramId,
        data,
    }));
}
exports.withdrawTokenFromSafetyDepositBox = withdrawTokenFromSafetyDepositBox;
async function updateExternalPriceAccount(externalPriceAccountKey, externalPriceAccount, instructions) {
    const vaultProgramId = ids_1.programIds().vault;
    const value = new UpdateExternalPriceAccountArgs({ externalPriceAccount });
    const data = Buffer.from(borsh_2.serialize(exports.VAULT_SCHEMA, value));
    console.log('Data', data);
    const keys = [
        {
            pubkey: externalPriceAccountKey,
            isSigner: false,
            isWritable: true,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: vaultProgramId,
        data,
    }));
}
exports.updateExternalPriceAccount = updateExternalPriceAccount;
//# sourceMappingURL=vault.js.map