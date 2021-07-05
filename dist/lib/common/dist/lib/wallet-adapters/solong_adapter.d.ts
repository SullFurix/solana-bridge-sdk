/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
declare const SolongAdapter_base: any;
export class SolongAdapter extends SolongAdapter_base {
    [x: string]: any;
    constructor(providerUrl: any, network: any);
    _publicKey: web3_js_1.PublicKey | null;
    _onProcess: boolean;
    connect(): void;
    get publicKey(): web3_js_1.PublicKey | null;
    signTransaction(transaction: any): Promise<any>;
    disconnect(): void;
}
import web3_js_1 = require("@solana/web3.js");
export {};
//# sourceMappingURL=solong_adapter.d.ts.map