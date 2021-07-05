/// <reference types="@solana/spl-token/node_modules/@solana/web3.js" />
/// <reference types="@solana/spl-token-swap/node_modules/@solana/web3.js" />
export var __esModule: boolean;
export var WRAPPED_SOL_MINT: web3_js_1.PublicKey;
export var TOKEN_PROGRAM_ID: web3_js_1.PublicKey;
export var LENDING_PROGRAM_ID: web3_js_1.PublicKey;
export var SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: web3_js_1.PublicKey;
export var BPF_UPGRADE_LOADER_ID: web3_js_1.PublicKey;
export var METADATA_PROGRAM_ID: web3_js_1.PublicKey;
export var MEMO_ID: web3_js_1.PublicKey;
export var VAULT_ID: web3_js_1.PublicKey;
export var AUCTION_ID: web3_js_1.PublicKey;
export var METAPLEX_ID: web3_js_1.PublicKey;
export var SYSTEM: web3_js_1.PublicKey;
export var LEND_HOST_FEE_ADDRESS: web3_js_1.PublicKey | undefined;
export var ENABLE_FEES_INPUT: boolean;
export var PROGRAM_IDS: {
    name: string;
    wormhole: () => {
        pubkey: web3_js_1.PublicKey;
        bridge: string;
        wrappedMaster: string;
    };
    swap: () => {
        current: {
            pubkey: web3_js_1.PublicKey;
            layout: any;
        };
        legacy: web3_js_1.PublicKey[];
    };
}[];
import web3_js_1 = require("@solana/web3.js");
export function setProgramIds(envName: any): void;
export function programIds(): {
    token: web3_js_1.PublicKey;
    swap: any;
    swap_legacy: any;
    swapLayout: any;
    lending: web3_js_1.PublicKey;
    wormhole: any;
    governance: any;
    associatedToken: web3_js_1.PublicKey;
    bpf_upgrade_loader: web3_js_1.PublicKey;
    system: web3_js_1.PublicKey;
    metadata: web3_js_1.PublicKey;
    memo: web3_js_1.PublicKey;
    vault: web3_js_1.PublicKey;
    auction: web3_js_1.PublicKey;
    metaplex: web3_js_1.PublicKey;
};
//# sourceMappingURL=ids.d.ts.map