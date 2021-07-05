export var __esModule: boolean;
export var AUCTION_PREFIX: string;
export var METADATA: string;
export var AuctionState: {};
export var BidStateType: {};
export var BASE_AUCTION_DATA_SIZE: number;
export var BIDDER_METADATA_LEN: number;
export var BIDDER_POT_LEN: number;
export var WinnerLimitType: {};
export var AUCTION_SCHEMA: Map<typeof StartAuctionArgs, {
    kind: string;
    fields: ((string | typeof WinnerLimit)[] | (string | {
        kind: string;
        type: string;
    })[])[];
} | {
    kind: string;
    fields: ((string | typeof BidState)[] | (string | {
        kind: string;
        type: string;
    })[])[];
} | {
    kind: string;
    fields: (string | (typeof Bid)[])[][];
}>;
export class Bid {
    constructor(args: any);
    key: any;
    amount: any;
}
export class BidState {
    constructor(args: any);
    type: any;
    bids: any;
    max: any;
    getWinnerIndex(bidder: any): any;
}
export function AuctionParser(pubkey: any, account: any): {
    pubkey: any;
    account: any;
    info: any;
};
export function decodeAuction(buffer: any): any;
export function BidderPotParser(pubkey: any, account: any): {
    pubkey: any;
    account: any;
    info: any;
};
export function decodeBidderPot(buffer: any): any;
export function BidderMetadataParser(pubkey: any, account: any): {
    pubkey: any;
    account: any;
    info: any;
};
export function decodeBidderMetadata(buffer: any): any;
export class AuctionData {
    constructor(args: any);
    authority: any;
    resource: any;
    tokenMint: any;
    lastBid: any;
    endedAt: any;
    endAuctionAt: any;
    auctionGap: any;
    state: any;
    bidState: any;
}
export class BidderMetadata {
    constructor(args: any);
    bidderPubkey: any;
    auctionPubkey: any;
    lastBid: any;
    lastBidTimestamp: any;
    cancelled: any;
}
export class BidderPot {
    constructor(args: any);
    bidderPot: any;
    bidderAct: any;
    auctionAct: any;
}
export class WinnerLimit {
    constructor(args: any);
    type: any;
    usize: any;
}
declare class StartAuctionArgs {
    constructor(args: any);
    instruction: number;
    resource: any;
}
export function decodeAuctionData(buffer: any): any;
export function createAuction(winners: any, resource: any, endAuctionAt: any, auctionGap: any, tokenMint: any, authority: any, creator: any, instructions: any): Promise<void>;
export function startAuction(resource: any, creator: any, instructions: any): Promise<void>;
export function placeBid(bidderPubkey: any, bidderPotTokenPubkey: any, tokenMintPubkey: any, transferAuthority: any, payer: any, resource: any, amount: any, instructions: any): Promise<void>;
export {};
//# sourceMappingURL=auction.d.ts.map