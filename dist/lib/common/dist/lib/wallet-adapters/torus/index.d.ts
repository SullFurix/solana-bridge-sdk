/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
declare const TorusWalletAdapter_base: any;
export class TorusWalletAdapter extends TorusWalletAdapter_base {
    [x: string]: any;
    constructor(providerUrl: any, endpoint: any);
    image: string;
    name: string;
    connect: () => Promise<void>;
    _provider: any;
    account: web3_js_1.Account;
    disconnect: () => Promise<void>;
    endpoint: any;
    providerUrl: any;
    signAllTransactions(transactions: any): Promise<any>;
    get publicKey(): web3_js_1.PublicKey | null;
    signTransaction(transaction: any): Promise<any>;
}
import web3_js_1 = require("@solana/web3.js");
export {};
//# sourceMappingURL=index.d.ts.map