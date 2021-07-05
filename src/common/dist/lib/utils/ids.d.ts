import { PublicKey } from '@solana/web3.js';
export declare const WRAPPED_SOL_MINT: PublicKey;
export declare let TOKEN_PROGRAM_ID: PublicKey;
export declare let LENDING_PROGRAM_ID: PublicKey;
export declare let SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey;
export declare let BPF_UPGRADE_LOADER_ID: PublicKey;
export declare let METADATA_PROGRAM_ID: PublicKey;
export declare const MEMO_ID: PublicKey;
export declare const VAULT_ID: PublicKey;
export declare const AUCTION_ID: PublicKey;
export declare const METAPLEX_ID: PublicKey;
export declare let SYSTEM: PublicKey;
export declare const LEND_HOST_FEE_ADDRESS: PublicKey | undefined;
export declare const ENABLE_FEES_INPUT = false;
export declare const PROGRAM_IDS: {
    name: string;
    wormhole: () => {
        pubkey: PublicKey;
        bridge: string;
        wrappedMaster: string;
    };
    swap: () => {
        current: {
            pubkey: PublicKey;
            layout: any;
        };
        legacy: PublicKey[];
    };
}[];
export declare const setProgramIds: (envName: string) => void;
export declare const programIds: () => {
    token: PublicKey;
    swap: PublicKey;
    swap_legacy: PublicKey[];
    swapLayout: any;
    lending: PublicKey;
    wormhole: {
        pubkey: PublicKey;
        bridge: string;
        wrappedMaster: string;
    };
    governance: {
        programId: PublicKey;
    };
    associatedToken: PublicKey;
    bpf_upgrade_loader: PublicKey;
    system: PublicKey;
    metadata: PublicKey;
    memo: PublicKey;
    vault: PublicKey;
    auction: PublicKey;
    metaplex: PublicKey;
};
//# sourceMappingURL=ids.d.ts.map