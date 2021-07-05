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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaBridge = exports.rustString = exports.uint256 = exports.uint64 = exports.publicKey = exports.u256 = exports.u64 = exports.CHAIN_ID_SOLANA = exports.LockupStatus = void 0;
const solanaWeb3 = __importStar(require("@solana/web3.js"));
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const assert_1 = __importDefault(require("assert"));
// @ts-ignore
const BufferLayout = __importStar(require("buffer-layout"));
const bs58 = __importStar(require("bs58"));
var LockupStatus;
(function (LockupStatus) {
    LockupStatus[LockupStatus["AWAITING_VAA"] = 0] = "AWAITING_VAA";
    LockupStatus[LockupStatus["UNCLAIMED_VAA"] = 1] = "UNCLAIMED_VAA";
    LockupStatus[LockupStatus["COMPLETED"] = 2] = "COMPLETED";
})(LockupStatus = exports.LockupStatus || (exports.LockupStatus = {}));
exports.CHAIN_ID_SOLANA = 1;
class SolanaBridge {
    constructor(endpoint, connection, programID, tokenProgram) {
        this.AccountLayout = BufferLayout.struct([
            exports.publicKey('mint'),
            exports.publicKey('owner'),
            exports.uint64('amount'),
            BufferLayout.u32('option'),
            exports.publicKey('delegate'),
            BufferLayout.u8('is_initialized'),
            BufferLayout.u8('is_native'),
            BufferLayout.u16('padding'),
            exports.uint64('delegatedAmount'),
        ]);
        this.endpoint = endpoint;
        this.programID = programID;
        this.tokenProgram = tokenProgram;
        this.connection = connection;
    }
    createPokeProposalInstruction(proposalAccount) {
        const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);
        const data = Buffer.alloc(dataLayout.span);
        dataLayout.encode({
            instruction: 5, // PokeProposal instruction
        }, data);
        const keys = [
            { pubkey: proposalAccount, isSigner: false, isWritable: true },
        ];
        return new web3_js_1.TransactionInstruction({
            keys,
            programId: this.programID,
            data,
        });
    }
    // fetchAssetMeta fetches the AssetMeta for an SPL token
    async fetchAssetMeta(mint) {
        // @ts-ignore
        let configKey = await this.getConfigKey();
        let seeds = [
            Buffer.from('meta'),
            configKey.toBuffer(),
            mint.toBuffer(),
        ];
        // @ts-ignore
        let metaKey = (await solanaWeb3.PublicKey.findProgramAddress(seeds, this.programID))[0];
        let metaInfo = await this.connection.getAccountInfo(metaKey);
        if (metaInfo == null || metaInfo.lamports == 0) {
            return {
                address: mint.toBuffer(),
                chain: exports.CHAIN_ID_SOLANA,
                decimals: 0,
            };
        }
        else {
            const dataLayout = BufferLayout.struct([
                BufferLayout.u8('assetChain'),
                BufferLayout.blob(32, 'assetAddress'),
            ]);
            let wrappedMeta = dataLayout.decode(metaInfo === null || metaInfo === void 0 ? void 0 : metaInfo.data);
            return {
                address: wrappedMeta.assetAddress,
                chain: wrappedMeta.assetChain,
                decimals: 0,
            };
        }
    }
    // fetchSignatureStatus fetches the signatures for a VAA
    async fetchSignatureStatus(signatureStatus) {
        let signatureInfo = await this.connection.getAccountInfo(signatureStatus, 'single');
        if (signatureInfo == null || signatureInfo.lamports == 0) {
            throw new Error('not found');
        }
        else {
            const dataLayout = BufferLayout.struct([
                BufferLayout.blob(20 * 65, 'signaturesRaw'),
            ]);
            let rawSignatureInfo = dataLayout.decode(signatureInfo === null || signatureInfo === void 0 ? void 0 : signatureInfo.data);
            let signatures = [];
            for (let i = 0; i < 20; i++) {
                let data = rawSignatureInfo.signaturesRaw.slice(65 * i, 65 * (i + 1));
                let empty = true;
                for (let v of data) {
                    if (v != 0) {
                        empty = false;
                        break;
                    }
                }
                if (empty)
                    continue;
                signatures.push({
                    signature: data,
                    index: i,
                });
            }
            return signatures;
        }
    }
    parseLockup(address, data) {
        const dataLayout = BufferLayout.struct([
            exports.uint256('amount'),
            BufferLayout.u8('toChain'),
            BufferLayout.blob(32, 'sourceAddress'),
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
            BufferLayout.blob(32, 'signatureAccount'),
            BufferLayout.u8('initialized'),
        ]);
        let parsedAccount = dataLayout.decode(data);
        return {
            lockupAddress: address,
            amount: new bn_js_1.default(parsedAccount.amount, 2, 'le'),
            assetAddress: parsedAccount.assetAddress,
            assetChain: parsedAccount.assetChain,
            assetDecimals: parsedAccount.assetDecimals,
            initialized: parsedAccount.initialized == 1,
            nonce: parsedAccount.nonce,
            sourceAddress: new web3_js_1.PublicKey(parsedAccount.sourceAddress),
            targetAddress: parsedAccount.targetAddress,
            toChain: parsedAccount.toChain,
            vaa: parsedAccount.vaa,
            vaaTime: parsedAccount.vaaTime,
            signatureAccount: new web3_js_1.PublicKey(parsedAccount.signatureAccount),
            pokeCounter: parsedAccount.pokeCounter,
        };
    }
    // fetchAssetMeta fetches the AssetMeta for an SPL token
    async fetchTransferProposals(tokenAccount) {
        let accountRes = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getProgramAccounts',
                params: [
                    this.programID.toString(),
                    {
                        commitment: 'single',
                        filters: [
                            { dataSize: 1184 },
                            {
                                memcmp: {
                                    offset: 33,
                                    bytes: tokenAccount.toString(),
                                },
                            },
                        ],
                    },
                ],
            }),
        });
        let raw_accounts = (await accountRes.json())['result'];
        let accounts = [];
        for (let acc of raw_accounts) {
            let pubkey = new web3_js_1.PublicKey(acc.pubkey);
            accounts.push(this.parseLockup(pubkey, bs58.decode(acc.account.data)));
        }
        return accounts;
    }
    async getConfigKey() {
        // @ts-ignore
        return (await solanaWeb3.PublicKey.findProgramAddress([Buffer.from('bridge')], this.programID))[0];
    }
}
exports.SolanaBridge = SolanaBridge;
// Taken from https://github.com/solana-labs/solana-program-library
// Licensed under Apache 2.0
class u64 extends bn_js_1.default {
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 8) {
            return b;
        }
        assert_1.default(b.length < 8, 'u64 too large');
        const zeroPad = Buffer.alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a u64 from Buffer representation
     */
    static fromBuffer(buffer) {
        assert_1.default(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
        return new bn_js_1.default(
        // @ts-ignore
        [...buffer]
            .reverse()
            .map(i => `00${i.toString(16)}`.slice(-2))
            .join(''), 16);
    }
}
exports.u64 = u64;
function padBuffer(b, len) {
    const zeroPad = Buffer.alloc(len);
    b.copy(zeroPad, len - b.length);
    return zeroPad;
}
class u256 extends bn_js_1.default {
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 32) {
            return b;
        }
        assert_1.default(b.length < 32, 'u256 too large');
        const zeroPad = Buffer.alloc(32);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a u256 from Buffer representation
     */
    static fromBuffer(buffer) {
        assert_1.default(buffer.length === 32, `Invalid buffer length: ${buffer.length}`);
        return new bn_js_1.default(
        // @ts-ignore
        [...buffer]
            .reverse()
            .map(i => `00${i.toString(16)}`.slice(-2))
            .join(''), 16);
    }
}
exports.u256 = u256;
/**
 * Layout for a public key
 */
const publicKey = (property = 'publicKey') => {
    return BufferLayout.blob(32, property);
};
exports.publicKey = publicKey;
/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = 'uint64') => {
    return BufferLayout.blob(8, property);
};
exports.uint64 = uint64;
/**
 * Layout for a 256-bit unsigned value
 */
const uint256 = (property = 'uint256') => {
    return BufferLayout.blob(32, property);
};
exports.uint256 = uint256;
/**
 * Layout for a Rust String type
 */
const rustString = (property = 'string') => {
    const rsl = BufferLayout.struct([
        BufferLayout.u32('length'),
        BufferLayout.u32('lengthPadding'),
        BufferLayout.blob(BufferLayout.offset(BufferLayout.u32(), -8), 'chars'),
    ], property);
    const _decode = rsl.decode.bind(rsl);
    const _encode = rsl.encode.bind(rsl);
    rsl.decode = (buffer, offset) => {
        const data = _decode(buffer, offset);
        return data.chars.toString('utf8');
    };
    rsl.encode = (str, buffer, offset) => {
        const data = {
            chars: Buffer.from(str, 'utf8'),
        };
        return _encode(data, buffer, offset);
    };
    return rsl;
};
exports.rustString = rustString;
//# sourceMappingURL=bridge.js.map