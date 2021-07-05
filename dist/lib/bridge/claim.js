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
exports.ClaimedVAA = void 0;
const BufferLayout = __importStar(require("buffer-layout"));
exports.ClaimedVAA = BufferLayout.struct([
    BufferLayout.blob(32, 'hash'),
    BufferLayout.u32('vaaTime'),
    BufferLayout.u8('initialized'),
    //BufferLayout.seq(BufferLayout.u8(), 3),
]);
/*
pub struct ClaimedVAA {
    /// hash of the vaa
    pub hash: [u8; 32],
    /// time the vaa was submitted
    pub vaa_time: u32,
    /// Is `true` if this structure has been initialized.
    pub is_initialized: bool,
}
*/
//# sourceMappingURL=claim.js.map