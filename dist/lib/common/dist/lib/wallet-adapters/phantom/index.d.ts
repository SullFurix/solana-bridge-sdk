/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
declare const PhantomWalletAdapter_base: any;
export class PhantomWalletAdapter extends PhantomWalletAdapter_base {
    [x: string]: any;
    connect: () => Promise<void>;
    _provider: any;
    get connected(): any;
    get autoApprove(): any;
    signAllTransactions(transactions: any): Promise<any>;
    get publicKey(): web3_js_1.PublicKey | null;
    _cachedCorrectKey: web3_js_1.PublicKey | undefined;
    signTransaction(transaction: any): Promise<any>;
    disconnect(): void;
}
import web3_js_1 = require("@solana/web3.js");
export {};
//# sourceMappingURL=index.d.ts.map