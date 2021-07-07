"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLockAssetInstruction = void 0;
const ids_1 = require("./../common/utils/ids");
const web3_js_1 = require("@solana/web3.js");
const BufferLayout = __importStar(require("buffer-layout"));
const helpers_1 = require("./helpers");
const constants_1 = require("./constants");
const createLockAssetInstruction = async (authorityKey, payer, tokenAccount, mint, amount, targetChain, targetAddress, asset, nonce) => {
    const programId = ids_1.programIds().wormhole.pubkey;
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        // uint256
        BufferLayout.blob(32, 'amount'),
        BufferLayout.u8('targetChain'),
        BufferLayout.blob(32, 'assetAddress'),
        BufferLayout.u8('assetChain'),
        BufferLayout.u8('assetDecimals'),
        BufferLayout.blob(32, 'targetAddress'),
        BufferLayout.seq(BufferLayout.u8(), 1),
        BufferLayout.u32('nonce'),
    ]);
    let nonceBuffer = Buffer.alloc(4);
    nonceBuffer.writeUInt32LE(nonce, 0);
    // @ts-ignore
    let seeds = [
        Buffer.from('transfer'),
        authorityKey.toBuffer(),
        Buffer.from([asset.chain]),
        helpers_1.padBuffer(asset.address, 32),
        Buffer.from([targetChain]),
        helpers_1.padBuffer(targetAddress, 32),
        tokenAccount.toBuffer(),
        nonceBuffer,
    ];
    // @ts-ignore
    let transferKey = (await web3_js_1.PublicKey.findProgramAddress(seeds, programId))[0];
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: 1,
        amount: helpers_1.padBuffer(Buffer.from(amount.toArray()), 32),
        targetChain: targetChain,
        assetAddress: helpers_1.padBuffer(asset.address, 32),
        assetChain: asset.chain,
        assetDecimals: asset.decimals,
        targetAddress: helpers_1.padBuffer(targetAddress, 32),
        nonce: nonce,
    }, data);
    const keys = [
        { pubkey: programId, isSigner: false, isWritable: false },
        {
            pubkey: web3_js_1.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: ids_1.programIds().token, isSigner: false, isWritable: false },
        {
            pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: tokenAccount, isSigner: false, isWritable: true },
        { pubkey: authorityKey, isSigner: false, isWritable: false },
        { pubkey: transferKey, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: true },
    ];
    if (asset.chain === constants_1.ASSET_CHAIN.Solana) {
        // @ts-ignore
        let custodyKey = (await web3_js_1.PublicKey.findProgramAddress([Buffer.from('custody'), authorityKey.toBuffer(), mint.toBuffer()], programId))[0];
        keys.push({ pubkey: custodyKey, isSigner: false, isWritable: true });
    }
    return {
        ix: new web3_js_1.TransactionInstruction({
            keys,
            programId: programId,
            data,
        }),
        transferKey: transferKey,
    };
};
exports.createLockAssetInstruction = createLockAssetInstruction;
//# sourceMappingURL=lock.js.map