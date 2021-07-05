"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programIds = exports.setProgramIds = exports.PROGRAM_IDS = exports.ENABLE_FEES_INPUT = exports.LEND_HOST_FEE_ADDRESS = exports.SYSTEM = exports.METAPLEX_ID = exports.AUCTION_ID = exports.VAULT_ID = exports.MEMO_ID = exports.METADATA_PROGRAM_ID = exports.BPF_UPGRADE_LOADER_ID = exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = exports.LENDING_PROGRAM_ID = exports.TOKEN_PROGRAM_ID = exports.WRAPPED_SOL_MINT = void 0;
const web3_js_1 = require("@solana/web3.js");
const tokenSwap_1 = require("../models/tokenSwap");
exports.WRAPPED_SOL_MINT = new web3_js_1.PublicKey('So11111111111111111111111111111111111111112');
exports.TOKEN_PROGRAM_ID = new web3_js_1.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
exports.LENDING_PROGRAM_ID = new web3_js_1.PublicKey('LendZqTs7gn5CTSJU1jWKhKuVpjJGom45nnwPb2AMTi');
exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new web3_js_1.PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
exports.BPF_UPGRADE_LOADER_ID = new web3_js_1.PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');
exports.METADATA_PROGRAM_ID = new web3_js_1.PublicKey('metaTA73sFPqA8whreUbBsbn3SLJH2vhrW9fP5dmfdC');
exports.MEMO_ID = new web3_js_1.PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
exports.VAULT_ID = new web3_js_1.PublicKey('94wRaYAQdC2gYF76AUTYSugNJ3rAC4EimjAMPwM7uYry');
exports.AUCTION_ID = new web3_js_1.PublicKey('C9nHkL6BfGx9M9MyYrJqAD5hPsGJd1fHpp1uAJA6vTCn');
exports.METAPLEX_ID = new web3_js_1.PublicKey('EPtpKdKW8qciGVd1UFyGjgbBHTbSAyvbY61h9uQGVgeu');
exports.SYSTEM = new web3_js_1.PublicKey('11111111111111111111111111111111');
let WORMHOLE_BRIDGE;
let GOVERNANCE;
let SWAP_PROGRAM_ID;
let SWAP_PROGRAM_LEGACY_IDS;
let SWAP_PROGRAM_LAYOUT;
exports.LEND_HOST_FEE_ADDRESS = process.env.REACT_APP_LEND_HOST_FEE_ADDRESS
    ? new web3_js_1.PublicKey(`${process.env.REACT_APP_LEND_HOST_FEE_ADDRESS}`)
    : undefined;
console.debug(`Lend host fee address: ${exports.LEND_HOST_FEE_ADDRESS === null || exports.LEND_HOST_FEE_ADDRESS === void 0 ? void 0 : exports.LEND_HOST_FEE_ADDRESS.toBase58()}`);
exports.ENABLE_FEES_INPUT = false;
// legacy pools are used to show users contributions in those pools to allow for withdrawals of funds
exports.PROGRAM_IDS = [
    {
        name: 'mainnet-beta',
        wormhole: () => ({
            pubkey: new web3_js_1.PublicKey('WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC'),
            bridge: '0xf92cD566Ea4864356C5491c177A430C222d7e678',
            wrappedMaster: '9A5e27995309a03f8B583feBdE7eF289FcCdC6Ae',
        }),
        swap: () => ({
            current: {
                pubkey: new web3_js_1.PublicKey('9qvG1zUp8xF1Bi4m6UdRNby1BAAuaDrUxSpv4CmRRMjL'),
                layout: tokenSwap_1.TokenSwapLayoutV1,
            },
            legacy: [
            // TODO: uncomment to enable legacy contract
            // new PublicKey("9qvG1zUp8xF1Bi4m6UdRNby1BAAuaDrUxSpv4CmRRMjL"),
            ],
        }),
    },
    {
        name: 'testnet',
        wormhole: () => ({
            pubkey: new web3_js_1.PublicKey('5gQf5AUhAgWYgUCt9ouShm9H7dzzXUsLdssYwe5krKhg'),
            bridge: '0x251bBCD91E84098509beaeAfF0B9951859af66D3',
            wrappedMaster: 'E39f0b145C0aF079B214c5a8840B2B01eA14794c',
        }),
        swap: () => ({
            current: {
                pubkey: new web3_js_1.PublicKey('2n2dsFSgmPcZ8jkmBZLGUM2nzuFqcBGQ3JEEj6RJJcEg'),
                layout: tokenSwap_1.TokenSwapLayoutV1,
            },
            legacy: [],
        }),
    },
    {
        name: 'devnet',
        wormhole: () => ({
            pubkey: new web3_js_1.PublicKey('WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC'),
            bridge: '0xf92cD566Ea4864356C5491c177A430C222d7e678',
            wrappedMaster: '9A5e27995309a03f8B583feBdE7eF289FcCdC6Ae',
        }),
        swap: () => ({
            current: {
                pubkey: new web3_js_1.PublicKey('6Cust2JhvweKLh4CVo1dt21s2PJ86uNGkziudpkNPaCj'),
                layout: tokenSwap_1.TokenSwapLayout,
            },
            legacy: [new web3_js_1.PublicKey('BSfTAcBdqmvX5iE2PW88WFNNp2DHhLUaBKk5WrnxVkcJ')],
        }),
    },
    {
        name: 'localnet',
        wormhole: () => ({
            pubkey: new web3_js_1.PublicKey('WormT3McKhFJ2RkiGpdw9GKvNCrB2aB54gb2uV9MfQC'),
            bridge: '0xf92cD566Ea4864356C5491c177A430C222d7e678',
            wrappedMaster: '9A5e27995309a03f8B583feBdE7eF289FcCdC6Ae',
        }),
        swap: () => ({
            current: {
                pubkey: new web3_js_1.PublicKey('369YmCWHGxznT7GGBhcLZDRcRoGWmGKFWdmtiPy78yj7'),
                layout: tokenSwap_1.TokenSwapLayoutV1,
            },
            legacy: [],
        }),
    },
];
const setProgramIds = (envName) => {
    let instance = exports.PROGRAM_IDS.find(env => envName.indexOf(env.name) >= 0);
    if (!instance) {
        return;
    }
    WORMHOLE_BRIDGE = instance.wormhole();
    let swap = instance.swap();
    SWAP_PROGRAM_ID = swap.current.pubkey;
    SWAP_PROGRAM_LAYOUT = swap.current.layout;
    SWAP_PROGRAM_LEGACY_IDS = swap.legacy;
    GOVERNANCE = instance.governance();
    if (envName === 'mainnet-beta') {
        exports.LENDING_PROGRAM_ID = new web3_js_1.PublicKey('LendZqTs7gn5CTSJU1jWKhKuVpjJGom45nnwPb2AMTi');
    }
};
exports.setProgramIds = setProgramIds;
const programIds = () => {
    return {
        token: exports.TOKEN_PROGRAM_ID,
        swap: SWAP_PROGRAM_ID,
        swap_legacy: SWAP_PROGRAM_LEGACY_IDS,
        swapLayout: SWAP_PROGRAM_LAYOUT,
        lending: exports.LENDING_PROGRAM_ID,
        wormhole: WORMHOLE_BRIDGE,
        governance: GOVERNANCE,
        associatedToken: exports.SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        bpf_upgrade_loader: exports.BPF_UPGRADE_LOADER_ID,
        system: exports.SYSTEM,
        metadata: exports.METADATA_PROGRAM_ID,
        memo: exports.MEMO_ID,
        vault: exports.VAULT_ID,
        auction: exports.AUCTION_ID,
        metaplex: exports.METAPLEX_ID,
    };
};
exports.programIds = programIds;
//# sourceMappingURL=ids.js.map