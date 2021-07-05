/// <reference types="node" />
/// <reference types="react" />
import { AccountInfo, Connection, PublicKey } from '@solana/web3.js';
import { MintInfo } from '@solana/spl-token';
import { TokenAccount } from '../models';
import { EventEmitter } from '../utils/eventEmitter';
export interface ParsedAccountBase {
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
    info: any;
}
export declare type AccountParser = (pubkey: PublicKey, data: AccountInfo<Buffer>) => ParsedAccountBase | undefined;
export interface ParsedAccount<T> extends ParsedAccountBase {
    info: T;
}
export declare const MintParser: (pubKey: PublicKey, info: AccountInfo<Buffer>) => ParsedAccountBase;
export declare const TokenAccountParser: (pubKey: PublicKey, info: AccountInfo<Buffer>) => TokenAccount;
export declare const GenericAccountParser: (pubKey: PublicKey, info: AccountInfo<Buffer>) => ParsedAccountBase;
export declare const keyToAccountParser: Map<string, AccountParser>;
export declare const cache: {
    emitter: EventEmitter;
    query: (connection: Connection, pubKey: string | PublicKey, parser?: AccountParser | undefined) => Promise<ParsedAccountBase>;
    add: (id: PublicKey | string, obj: AccountInfo<Buffer>, parser?: AccountParser | undefined) => ParsedAccountBase | undefined;
    get: (pubKey: string | PublicKey) => ParsedAccountBase | undefined;
    delete: (pubKey: string | PublicKey) => boolean;
    byParser: (parser: AccountParser) => string[];
    registerParser: (pubkey: PublicKey | string, parser: AccountParser) => string | PublicKey;
    queryMint: (connection: Connection, pubKey: string | PublicKey) => Promise<MintInfo>;
    getMint: (pubKey: string | PublicKey) => MintInfo | undefined;
    addMint: (pubKey: PublicKey, obj: AccountInfo<Buffer>) => MintInfo;
};
export declare const useAccountsContext: () => any;
export declare const getCachedAccount: (predicate: (account: TokenAccount) => boolean) => TokenAccount | undefined;
export declare function AccountsProvider({ children }: {
    children?: any;
}): JSX.Element;
export declare function useNativeAccount(): {
    account: AccountInfo<Buffer>;
};
export declare const getMultipleAccounts: (connection: any, keys: string[], commitment: string) => Promise<{
    keys: string[];
    array: AccountInfo<Buffer>[];
}>;
export declare function useMint(key?: string | PublicKey): MintInfo | undefined;
export declare function useAccount(pubKey?: PublicKey): TokenAccount | undefined;
export declare const deserializeAccount: (data: Buffer) => any;
export declare const deserializeMint: (data: Buffer) => MintInfo;
//# sourceMappingURL=accounts.d.ts.map