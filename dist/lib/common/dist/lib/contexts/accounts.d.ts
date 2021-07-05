export var __esModule: boolean;
export var keyToAccountParser: Map<any, any>;
export namespace cache {
    export const emitter: eventEmitter_1.EventEmitter;
    export function query(connection: any, pubKey: any, parser: any): Promise<any>;
    export function add(id: any, obj: any, parser: any): any;
    export function get(pubKey: any): any;
    export function _delete(pubKey: any): boolean;
    export { _delete as delete };
    export function byParser(parser: any): any[];
    export function registerParser(pubkey: any, parser: any): any;
    export function queryMint(connection: any, pubKey: any): Promise<any>;
    export function getMint(pubKey: any): any;
    export function addMint(pubKey: any, obj: any): any;
}
export function MintParser(pubKey: any, info: any): {
    pubkey: any;
    account: any;
    info: any;
};
export function TokenAccountParser(pubKey: any, info: any): {
    pubkey: any;
    account: any;
    info: any;
};
export function GenericAccountParser(pubKey: any, info: any): {
    pubkey: any;
    account: any;
    info: Buffer;
};
import eventEmitter_1 = require("../utils/eventEmitter");
export function useAccountsContext(): any;
export function getCachedAccount(predicate: any): any;
export function AccountsProvider({ children }: {
    children?: any;
}): any;
export function useNativeAccount(): {
    account: any;
};
export function getMultipleAccounts(connection: any, keys: any, commitment: any): Promise<{
    keys: any;
    array: any[];
}>;
export function useMint(key: any): any;
export function useAccount(pubKey: any): any;
export function deserializeAccount(data: any): any;
export function deserializeMint(data: any): any;
//# sourceMappingURL=accounts.d.ts.map