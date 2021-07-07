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
exports.createWrappedAssetInstruction = exports.createWrappedLayout = exports.WrappedMetaLayout = void 0;
const ids_1 = require("./../common/utils/ids");
const web3_js_1 = require("@solana/web3.js");
const BufferLayout = __importStar(require("buffer-layout"));
const helpers_1 = require("./helpers");
exports.WrappedMetaLayout = BufferLayout.struct([
    BufferLayout.u8('chain'),
    BufferLayout.blob(32, 'address'),
    BufferLayout.u8('isInitialized'),
]);
exports.createWrappedLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    BufferLayout.blob(32, 'assetAddress'),
    BufferLayout.u8('chain'),
    BufferLayout.u8('decimals'),
]);
const createWrappedAssetInstruction = async (meta, bridgeId, authorityKey, mintKey, payer) => {
    let metaKey = await helpers_1.wrappedAssetMetaKey(bridgeId, authorityKey, mintKey);
    const wa_keys = [
        {
            pubkey: web3_js_1.SystemProgram.programId,
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
        {
            pubkey: authorityKey,
            isSigner: false,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: mintKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: metaKey,
            isSigner: false,
            isWritable: true,
        },
    ];
    const wrappedData = Buffer.alloc(exports.createWrappedLayout.span);
    exports.createWrappedLayout.encode({
        instruction: 7,
        assetAddress: helpers_1.padBuffer(meta.address, 32),
        chain: meta.chain,
        decimals: meta.decimals,
    }, wrappedData);
    return new web3_js_1.TransactionInstruction({
        keys: wa_keys,
        programId: bridgeId,
        data: wrappedData,
    });
};
exports.createWrappedAssetInstruction = createWrappedAssetInstruction;
//# sourceMappingURL=meta.js.map