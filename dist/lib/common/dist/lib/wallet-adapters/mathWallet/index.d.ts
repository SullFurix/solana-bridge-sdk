/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
declare const MathWalletAdapter_base: any;
export class MathWalletAdapter extends MathWalletAdapter_base {
    [x: string]: any;
    _publicKey: web3_js_1.PublicKey | null;
    _onProcess: boolean;
    _connected: boolean;
    connect(): void;
    get publicKey(): web3_js_1.PublicKey | null;
    get connected(): boolean;
    get autoApprove(): boolean;
    signAllTransactions(transactions: any): Promise<any>;
    get _provider(): any;
    signTransaction(transaction: any): any;
    disconnect(): void;
}
import web3_js_1 = require("@solana/web3.js");
export {};
//# sourceMappingURL=index.d.ts.map