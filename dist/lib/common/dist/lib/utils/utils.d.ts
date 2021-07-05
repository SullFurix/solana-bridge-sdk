/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
export var formatPriceNumber: Intl.NumberFormat;
export var STABLE_COINS: Set<string>;
export var formatUSD: Intl.NumberFormat;
export namespace formatNumber {
    function format(val: any): string;
}
export var formatPct: Intl.NumberFormat;
export function useLocalStorageState(key: any, defaultState: any): any[];
export function shortenAddress(address: any, chars?: number): string;
export function getTokenName(map: any, mint: any, shorten?: boolean): any;
export function getVerboseTokenName(map: any, mint: any, shorten?: boolean): any;
export function getTokenByName(tokenMap: any, name: any): any;
export function getTokenIcon(map: any, mintAddress: any): any;
export function isKnownMint(map: any, mintAddress: any): boolean;
export function chunks(array: any, size: any): any[];
export function toLamports(account: any, mint: any): number;
export function wadToLamports(amount: any): any;
export function fromLamports(account: any, mint: any, rate?: number): number;
export function tryParseKey(key: any): web3_js_1.PublicKey | null;
export function formatAmount(val: any, precision?: number, abbr?: boolean): any;
export function formatTokenAmount(account: any, mint: any, rate?: number, prefix?: string, suffix?: string, precision?: number, abbr?: boolean): string;
export function convert(account: any, mint: any, rate?: number): number;
export function sleep(ms: any): Promise<any>;
import web3_js_1 = require("@solana/web3.js");
//# sourceMappingURL=utils.d.ts.map