"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeBid = exports.startAuction = exports.createAuction = exports.decodeAuctionData = exports.AUCTION_SCHEMA = exports.WinnerLimit = exports.WinnerLimitType = exports.BidderPot = exports.BIDDER_POT_LEN = exports.BidderMetadata = exports.BIDDER_METADATA_LEN = exports.AuctionData = exports.BASE_AUCTION_DATA_SIZE = exports.decodeBidderMetadata = exports.BidderMetadataParser = exports.decodeBidderPot = exports.BidderPotParser = exports.decodeAuction = exports.AuctionParser = exports.BidState = exports.Bid = exports.BidStateType = exports.AuctionState = exports.METADATA = exports.AUCTION_PREFIX = void 0;
const web3_js_1 = require("@solana/web3.js");
const ids_1 = require("../utils/ids");
const borsh_1 = require("./../utils/borsh");
const borsh_2 = require("borsh");
exports.AUCTION_PREFIX = 'auction';
exports.METADATA = 'metadata';
var AuctionState;
(function (AuctionState) {
    AuctionState[AuctionState["Created"] = 0] = "Created";
    AuctionState[AuctionState["Started"] = 1] = "Started";
    AuctionState[AuctionState["Ended"] = 2] = "Ended";
})(AuctionState = exports.AuctionState || (exports.AuctionState = {}));
var BidStateType;
(function (BidStateType) {
    BidStateType[BidStateType["EnglishAuction"] = 0] = "EnglishAuction";
    BidStateType[BidStateType["OpenEdition"] = 1] = "OpenEdition";
})(BidStateType = exports.BidStateType || (exports.BidStateType = {}));
class Bid {
    constructor(args) {
        this.key = args.key;
        this.amount = args.amount;
    }
}
exports.Bid = Bid;
class BidState {
    constructor(args) {
        this.type = args.type;
        this.bids = args.bids;
        this.max = args.max;
    }
    getWinnerIndex(bidder) {
        if (!this.bids)
            return null;
        console.log('bids', this.bids.map(b => b.key.toBase58()), bidder.toBase58());
        const index = this.bids.findIndex(b => b.key.toBase58() == bidder.toBase58());
        if (index != -1)
            return index;
        else
            return null;
    }
}
exports.BidState = BidState;
const AuctionParser = (pubkey, account) => ({
    pubkey,
    account,
    info: exports.decodeAuction(account.data),
});
exports.AuctionParser = AuctionParser;
const decodeAuction = (buffer) => {
    return borsh_1.deserializeBorsh(exports.AUCTION_SCHEMA, AuctionData, buffer);
};
exports.decodeAuction = decodeAuction;
const BidderPotParser = (pubkey, account) => ({
    pubkey,
    account,
    info: exports.decodeBidderPot(account.data),
});
exports.BidderPotParser = BidderPotParser;
const decodeBidderPot = (buffer) => {
    return borsh_1.deserializeBorsh(exports.AUCTION_SCHEMA, BidderPot, buffer);
};
exports.decodeBidderPot = decodeBidderPot;
const BidderMetadataParser = (pubkey, account) => ({
    pubkey,
    account,
    info: exports.decodeBidderMetadata(account.data),
});
exports.BidderMetadataParser = BidderMetadataParser;
const decodeBidderMetadata = (buffer) => {
    return borsh_1.deserializeBorsh(exports.AUCTION_SCHEMA, BidderMetadata, buffer);
};
exports.decodeBidderMetadata = decodeBidderMetadata;
exports.BASE_AUCTION_DATA_SIZE = 32 + 32 + 32 + 8 + 8 + 1 + 9 + 9 + 9 + 9;
class AuctionData {
    constructor(args) {
        this.authority = args.authority;
        this.resource = args.resource;
        this.tokenMint = args.tokenMint;
        this.lastBid = args.lastBid;
        this.endedAt = args.endedAt;
        this.endAuctionAt = args.endAuctionAt;
        this.auctionGap = args.auctionGap;
        this.state = args.state;
        this.bidState = args.bidState;
    }
}
exports.AuctionData = AuctionData;
exports.BIDDER_METADATA_LEN = 32 + 32 + 8 + 8 + 1;
class BidderMetadata {
    constructor(args) {
        this.bidderPubkey = args.bidderPubkey;
        this.auctionPubkey = args.auctionPubkey;
        this.lastBid = args.lastBid;
        this.lastBidTimestamp = args.lastBidTimestamp;
        this.cancelled = args.cancelled;
    }
}
exports.BidderMetadata = BidderMetadata;
exports.BIDDER_POT_LEN = 32 + 32 + 32;
class BidderPot {
    constructor(args) {
        this.bidderPot = args.bidderPot;
        this.bidderAct = args.bidderAct;
        this.auctionAct = args.auctionAct;
    }
}
exports.BidderPot = BidderPot;
var WinnerLimitType;
(function (WinnerLimitType) {
    WinnerLimitType[WinnerLimitType["Unlimited"] = 0] = "Unlimited";
    WinnerLimitType[WinnerLimitType["Capped"] = 1] = "Capped";
})(WinnerLimitType = exports.WinnerLimitType || (exports.WinnerLimitType = {}));
class WinnerLimit {
    constructor(args) {
        this.type = args.type;
        this.usize = args.usize;
    }
}
exports.WinnerLimit = WinnerLimit;
class CreateAuctionArgs {
    constructor(args) {
        this.instruction = 0;
        this.winners = args.winners;
        this.endAuctionAt = args.endAuctionAt;
        this.auctionGap = args.auctionGap;
        this.tokenMint = args.tokenMint;
        this.authority = args.authority;
        this.resource = args.resource;
    }
}
class StartAuctionArgs {
    constructor(args) {
        this.instruction = 1;
        this.resource = args.resource;
    }
}
class PlaceBidArgs {
    constructor(args) {
        this.instruction = 2;
        this.resource = args.resource;
        this.amount = args.amount;
    }
}
exports.AUCTION_SCHEMA = new Map([
    [
        CreateAuctionArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['winners', WinnerLimit],
                ['endAuctionAt', { kind: 'option', type: 'u64' }],
                ['auctionGap', { kind: 'option', type: 'u64' }],
                ['tokenMint', 'pubkey'],
                ['authority', 'pubkey'],
                ['resource', 'pubkey'],
            ],
        },
    ],
    [
        WinnerLimit,
        {
            kind: 'struct',
            fields: [
                ['type', 'u8'],
                ['usize', 'u64'],
            ],
        },
    ],
    [
        StartAuctionArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['resource', 'pubkey'],
            ],
        },
    ],
    [
        PlaceBidArgs,
        {
            kind: 'struct',
            fields: [
                ['instruction', 'u8'],
                ['amount', 'u64'],
                ['resource', 'pubkey'],
            ],
        },
    ],
    [
        AuctionData,
        {
            kind: 'struct',
            fields: [
                ['authority', 'pubkey'],
                ['resource', 'pubkey'],
                ['tokenMint', 'pubkey'],
                ['lastBid', { kind: 'option', type: 'u64' }],
                ['endedAt', { kind: 'option', type: 'u64' }],
                ['endAuctionAt', { kind: 'option', type: 'u64' }],
                ['auctionGap', { kind: 'option', type: 'u64' }],
                ['state', 'u8'],
                ['bidState', BidState],
            ],
        },
    ],
    [
        BidState,
        {
            kind: 'struct',
            fields: [
                ['type', 'u8'],
                ['bids', [Bid]],
                ['max', 'u64'],
            ],
        },
    ],
    [
        Bid,
        {
            kind: 'struct',
            fields: [
                ['key', 'pubkey'],
                ['amount', 'u64'],
            ],
        },
    ],
    [
        BidderMetadata,
        {
            kind: 'struct',
            fields: [
                ['bidderPubkey', 'pubkey'],
                ['auctionPubkey', 'pubkey'],
                ['lastBid', 'u64'],
                ['lastBidTimestamp', 'u64'],
                ['cancelled', 'u8'],
            ],
        },
    ],
    [
        BidderPot,
        {
            kind: 'struct',
            fields: [
                ['bidderPot', 'pubkey'],
                ['bidderAct', 'pubkey'],
                ['auctionAct', 'pubkey'],
            ],
        },
    ],
]);
const decodeAuctionData = (buffer) => {
    return borsh_1.deserializeBorsh(exports.AUCTION_SCHEMA, AuctionData, buffer);
};
exports.decodeAuctionData = decodeAuctionData;
async function createAuction(winners, resource, endAuctionAt, auctionGap, tokenMint, authority, creator, instructions) {
    const auctionProgramId = ids_1.programIds().auction;
    const data = Buffer.from(borsh_2.serialize(exports.AUCTION_SCHEMA, new CreateAuctionArgs({
        winners,
        resource,
        endAuctionAt,
        auctionGap,
        tokenMint,
        authority,
    })));
    const auctionKey = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.AUCTION_PREFIX),
        auctionProgramId.toBuffer(),
        resource.toBuffer(),
    ], auctionProgramId))[0];
    const keys = [
        {
            pubkey: creator,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: auctionKey,
            isSigner: false,
            isWritable: true,
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
        programId: auctionProgramId,
        data: data,
    }));
}
exports.createAuction = createAuction;
async function startAuction(resource, creator, instructions) {
    const auctionProgramId = ids_1.programIds().auction;
    const data = Buffer.from(borsh_2.serialize(exports.AUCTION_SCHEMA, new StartAuctionArgs({
        resource,
    })));
    const auctionKey = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.AUCTION_PREFIX),
        auctionProgramId.toBuffer(),
        resource.toBuffer(),
    ], auctionProgramId))[0];
    const keys = [
        {
            pubkey: creator,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: auctionKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: auctionProgramId,
        data: data,
    }));
}
exports.startAuction = startAuction;
async function placeBid(bidderPubkey, bidderPotTokenPubkey, tokenMintPubkey, transferAuthority, payer, resource, amount, instructions) {
    const auctionProgramId = ids_1.programIds().auction;
    const data = Buffer.from(borsh_2.serialize(exports.AUCTION_SCHEMA, new PlaceBidArgs({
        resource,
        amount,
    })));
    const auctionKey = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.AUCTION_PREFIX),
        auctionProgramId.toBuffer(),
        resource.toBuffer(),
    ], auctionProgramId))[0];
    const bidderPotKey = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.AUCTION_PREFIX),
        auctionProgramId.toBuffer(),
        auctionKey.toBuffer(),
        bidderPubkey.toBuffer(),
    ], auctionProgramId))[0];
    const bidderMetaKey = (await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from(exports.AUCTION_PREFIX),
        auctionProgramId.toBuffer(),
        auctionKey.toBuffer(),
        bidderPubkey.toBuffer(),
        Buffer.from('metadata'),
    ], auctionProgramId))[0];
    const keys = [
        {
            pubkey: bidderPubkey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: bidderPotKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: bidderPotTokenPubkey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: bidderMetaKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: auctionKey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: tokenMintPubkey,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: transferAuthority,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: payer,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: web3_js_1.SYSVAR_CLOCK_PUBKEY,
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
        {
            pubkey: ids_1.programIds().token,
            isSigner: false,
            isWritable: false,
        },
    ];
    instructions.push(new web3_js_1.TransactionInstruction({
        keys,
        programId: auctionProgramId,
        data: data,
    }));
}
exports.placeBid = placeBid;
//# sourceMappingURL=auction.js.map