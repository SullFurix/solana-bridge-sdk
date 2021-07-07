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
exports.TransferOutProposalLayout = void 0;
const layout_1 = require("./../common/utils/layout");
const BufferLayout = __importStar(require("buffer-layout"));
// 1184 TransferOutProposal
exports.TransferOutProposalLayout = BufferLayout.struct([
    BufferLayout.blob(32, 'amount'),
    BufferLayout.u8('toChain'),
    layout_1.publicKey('sourceAddress'),
    BufferLayout.blob(32, 'targetAddress'),
    BufferLayout.blob(32, 'assetAddress'),
    BufferLayout.u8('assetChain'),
    BufferLayout.u8('assetDecimals'),
    BufferLayout.seq(BufferLayout.u8(), 1),
    BufferLayout.u32('nonce'),
    BufferLayout.blob(1001, 'vaa'),
    BufferLayout.seq(BufferLayout.u8(), 3),
    BufferLayout.u32('vaaTime'),
    BufferLayout.u32('lockupTime'),
    BufferLayout.u8('pokeCounter'),
    layout_1.publicKey('signatureAccount'),
    BufferLayout.u8('initialized'),
    BufferLayout.seq(BufferLayout.u8(), 2), // 2 byte alignment
]);
//# sourceMappingURL=transferOutProposal.js.map