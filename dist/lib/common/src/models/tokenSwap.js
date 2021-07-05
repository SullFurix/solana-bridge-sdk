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
exports.TokenSwapLayout = exports.TokenSwapLayoutV1 = exports.TokenSwapLayoutLegacyV0 = exports.TokenSwap = void 0;
const BufferLayout = __importStar(require("buffer-layout"));
const layout_1 = require("../utils/layout");
var spl_token_swap_1 = require("@solana/spl-token-swap");
Object.defineProperty(exports, "TokenSwap", { enumerable: true, get: function () { return spl_token_swap_1.TokenSwap; } });
const FEE_LAYOUT = BufferLayout.struct([
    BufferLayout.nu64('tradeFeeNumerator'),
    BufferLayout.nu64('tradeFeeDenominator'),
    BufferLayout.nu64('ownerTradeFeeNumerator'),
    BufferLayout.nu64('ownerTradeFeeDenominator'),
    BufferLayout.nu64('ownerWithdrawFeeNumerator'),
    BufferLayout.nu64('ownerWithdrawFeeDenominator'),
    BufferLayout.nu64('hostFeeNumerator'),
    BufferLayout.nu64('hostFeeDenominator'),
], 'fees');
exports.TokenSwapLayoutLegacyV0 = BufferLayout.struct([
    BufferLayout.u8('isInitialized'),
    BufferLayout.u8('nonce'),
    layout_1.publicKey('tokenAccountA'),
    layout_1.publicKey('tokenAccountB'),
    layout_1.publicKey('tokenPool'),
    layout_1.uint64('feesNumerator'),
    layout_1.uint64('feesDenominator'),
]);
exports.TokenSwapLayoutV1 = BufferLayout.struct([
    BufferLayout.u8('isInitialized'),
    BufferLayout.u8('nonce'),
    layout_1.publicKey('tokenProgramId'),
    layout_1.publicKey('tokenAccountA'),
    layout_1.publicKey('tokenAccountB'),
    layout_1.publicKey('tokenPool'),
    layout_1.publicKey('mintA'),
    layout_1.publicKey('mintB'),
    layout_1.publicKey('feeAccount'),
    BufferLayout.u8('curveType'),
    layout_1.uint64('tradeFeeNumerator'),
    layout_1.uint64('tradeFeeDenominator'),
    layout_1.uint64('ownerTradeFeeNumerator'),
    layout_1.uint64('ownerTradeFeeDenominator'),
    layout_1.uint64('ownerWithdrawFeeNumerator'),
    layout_1.uint64('ownerWithdrawFeeDenominator'),
    BufferLayout.blob(16, 'padding'),
]);
const CURVE_NODE = BufferLayout.union(BufferLayout.u8(), BufferLayout.blob(32), 'curve');
CURVE_NODE.addVariant(0, BufferLayout.struct([]), 'constantProduct');
CURVE_NODE.addVariant(1, BufferLayout.struct([BufferLayout.nu64('token_b_price')]), 'constantPrice');
CURVE_NODE.addVariant(2, BufferLayout.struct([]), 'stable');
CURVE_NODE.addVariant(3, BufferLayout.struct([BufferLayout.nu64('token_b_offset')]), 'offset');
exports.TokenSwapLayout = BufferLayout.struct([
    BufferLayout.u8('isInitialized'),
    BufferLayout.u8('nonce'),
    layout_1.publicKey('tokenProgramId'),
    layout_1.publicKey('tokenAccountA'),
    layout_1.publicKey('tokenAccountB'),
    layout_1.publicKey('tokenPool'),
    layout_1.publicKey('mintA'),
    layout_1.publicKey('mintB'),
    layout_1.publicKey('feeAccount'),
    FEE_LAYOUT,
    CURVE_NODE,
]);
//# sourceMappingURL=tokenSwap.js.map