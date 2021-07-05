"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.padBuffer = exports.wrappedAssetMetaKey = exports.wrappedAssetMintKey = exports.bridgeAuthorityKey = void 0;
const web3_js_1 = require("@solana/web3.js");
const bridgeAuthorityKey = async (bridgeId) => {
    // @ts-ignore
    return (await web3_js_1.PublicKey.findProgramAddress([Buffer.from('bridge')], bridgeId))[0];
};
exports.bridgeAuthorityKey = bridgeAuthorityKey;
const wrappedAssetMintKey = async (bridgeId, authority, asset) => {
    if (asset.chain === 1) {
        return new web3_js_1.PublicKey(asset.address);
    }
    let seeds = [
        Buffer.from('wrapped'),
        authority.toBuffer(),
        Buffer.of(asset.chain),
        Buffer.of(asset.decimals),
        padBuffer(asset.address, 32),
    ];
    // @ts-ignore
    return (await web3_js_1.PublicKey.findProgramAddress(seeds, bridgeId))[0];
};
exports.wrappedAssetMintKey = wrappedAssetMintKey;
const wrappedAssetMetaKey = async (bridgeId, authority, mint) => {
    let seeds = [
        Buffer.from('meta'),
        authority.toBuffer(),
        mint.toBuffer(),
    ];
    // @ts-ignore
    return (await web3_js_1.PublicKey.findProgramAddress(seeds, bridgeId))[0];
};
exports.wrappedAssetMetaKey = wrappedAssetMetaKey;
function padBuffer(b, len) {
    const zeroPad = Buffer.alloc(len);
    b.copy(zeroPad, len - b.length);
    return zeroPad;
}
exports.padBuffer = padBuffer;
//# sourceMappingURL=helpers.js.map