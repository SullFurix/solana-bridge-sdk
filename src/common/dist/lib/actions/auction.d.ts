/// <reference types="node" />
import { PublicKey, TransactionInstruction } from '@solana/web3.js';
import BN from 'bn.js';
import { AccountParser } from '../contexts';
export declare const AUCTION_PREFIX = "auction";
export declare const METADATA = "metadata";
export declare enum AuctionState {
    Created = 0,
    Started = 1,
    Ended = 2
}
export declare enum BidStateType {
    EnglishAuction = 0,
    OpenEdition = 1
}
export declare class Bid {
    key: PublicKey;
    amount: BN;
    constructor(args: {
        key: PublicKey;
        amount: BN;
    });
}
export declare class BidState {
    type: BidStateType;
    bids: Bid[];
    max: BN;
    getWinnerIndex(bidder: PublicKey): number | null;
    constructor(args: {
        type: BidStateType;
        bids: Bid[];
        max: BN;
    });
}
export declare const AuctionParser: AccountParser;
export declare const decodeAuction: (buffer: Buffer) => AuctionData;
export declare const BidderPotParser: AccountParser;
export declare const decodeBidderPot: (buffer: Buffer) => BidderPot;
export declare const BidderMetadataParser: AccountParser;
export declare const decodeBidderMetadata: (buffer: Buffer) => BidderMetadata;
export declare const BASE_AUCTION_DATA_SIZE: number;
export declare class AuctionData {
    authority: PublicKey;
    resource: PublicKey;
    tokenMint: PublicKey;
    lastBid: BN | null;
    endedAt: BN | null;
    endAuctionAt: BN | null;
    auctionGap: BN | null;
    state: AuctionState;
    bidState: BidState;
    auctionManagerKey?: PublicKey;
    bidRedemptionKey?: PublicKey;
    constructor(args: {
        authority: PublicKey;
        resource: PublicKey;
        tokenMint: PublicKey;
        lastBid: BN | null;
        endedAt: BN | null;
        endAuctionAt: BN | null;
        auctionGap: BN | null;
        state: AuctionState;
        bidState: BidState;
    });
}
export declare const BIDDER_METADATA_LEN: number;
export declare class BidderMetadata {
    bidderPubkey: PublicKey;
    auctionPubkey: PublicKey;
    lastBid: BN;
    lastBidTimestamp: BN;
    cancelled: boolean;
    constructor(args: {
        bidderPubkey: PublicKey;
        auctionPubkey: PublicKey;
        lastBid: BN;
        lastBidTimestamp: BN;
        cancelled: boolean;
    });
}
export declare const BIDDER_POT_LEN: number;
export declare class BidderPot {
    bidderPot: PublicKey;
    bidderAct: PublicKey;
    auctionAct: PublicKey;
    constructor(args: {
        bidderPot: PublicKey;
        bidderAct: PublicKey;
        auctionAct: PublicKey;
    });
}
export declare enum WinnerLimitType {
    Unlimited = 0,
    Capped = 1
}
export declare class WinnerLimit {
    type: WinnerLimitType;
    usize: BN;
    constructor(args: {
        type: WinnerLimitType;
        usize: BN;
    });
}
export declare const AUCTION_SCHEMA: Map<any, any>;
export declare const decodeAuctionData: (buffer: Buffer) => AuctionData;
export declare function createAuction(winners: WinnerLimit, resource: PublicKey, endAuctionAt: BN | null, auctionGap: BN | null, tokenMint: PublicKey, authority: PublicKey, creator: PublicKey, instructions: TransactionInstruction[]): Promise<void>;
export declare function startAuction(resource: PublicKey, creator: PublicKey, instructions: TransactionInstruction[]): Promise<void>;
export declare function placeBid(bidderPubkey: PublicKey, bidderPotTokenPubkey: PublicKey, tokenMintPubkey: PublicKey, transferAuthority: PublicKey, payer: PublicKey, resource: PublicKey, amount: BN, instructions: TransactionInstruction[]): Promise<void>;
//# sourceMappingURL=auction.d.ts.map