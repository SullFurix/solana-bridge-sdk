/// <reference types="node" />
import { BigNumber } from 'bignumber.js';
import { ethers } from 'ethers';
import { ASSET_CHAIN } from '../constants';
export interface ProgressUpdate {
    message: string;
    type: string;
    step: number;
    group: string;
    replace?: boolean;
}
export interface TransferRequestInfo {
    address: string;
    name: string;
    balance: BigNumber;
    decimals: number;
    allowance: ethers.utils.BigNumber;
    isWrapped: boolean;
    chainID: number;
    assetAddress: Buffer;
    mint: string;
}
export interface TransferRequest {
    amount?: number;
    info?: TransferRequestInfo;
    from?: ASSET_CHAIN;
    asset?: string;
    to?: ASSET_CHAIN;
    recipient?: Buffer;
}
export declare const displayBalance: (info?: TransferRequestInfo | undefined) => number;
//# sourceMappingURL=interface.d.ts.map