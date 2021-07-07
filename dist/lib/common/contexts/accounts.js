"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeMint = exports.deserializeAccount = exports.useAccount = exports.useMint = exports.getMultipleAccounts = exports.useNativeAccount = exports.AccountsProvider = exports.getCachedAccount = exports.useAccountsContext = exports.cache = exports.keyToAccountParser = exports.GenericAccountParser = exports.TokenAccountParser = exports.MintParser = void 0;
const react_1 = __importStar(require("react"));
const connection_1 = require("../contexts/connection");
const wallet_1 = require("../contexts/wallet");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const utils_1 = require("../utils/utils");
const eventEmitter_1 = require("../utils/eventEmitter");
const ids_1 = require("../utils/ids");
const AccountsContext = react_1.default.createContext(null);
const pendingCalls = new Map();
const genericCache = new Map();
const pendingMintCalls = new Map();
const mintCache = new Map();
const getMintInfo = async (connection, pubKey) => {
    const info = await connection.getAccountInfo(pubKey);
    if (info === null) {
        throw new Error('Failed to find mint account');
    }
    const data = Buffer.from(info.data);
    return exports.deserializeMint(data);
};
const MintParser = (pubKey, info) => {
    const buffer = Buffer.from(info.data);
    const data = exports.deserializeMint(buffer);
    const details = {
        pubkey: pubKey,
        account: {
            ...info,
        },
        info: data,
    };
    return details;
};
exports.MintParser = MintParser;
const TokenAccountParser = (pubKey, info) => {
    const buffer = Buffer.from(info.data);
    const data = exports.deserializeAccount(buffer);
    const details = {
        pubkey: pubKey,
        account: {
            ...info,
        },
        info: data,
    };
    return details;
};
exports.TokenAccountParser = TokenAccountParser;
const GenericAccountParser = (pubKey, info) => {
    const buffer = Buffer.from(info.data);
    const details = {
        pubkey: pubKey,
        account: {
            ...info,
        },
        info: buffer,
    };
    return details;
};
exports.GenericAccountParser = GenericAccountParser;
exports.keyToAccountParser = new Map();
exports.cache = {
    emitter: new eventEmitter_1.EventEmitter(),
    query: async (connection, pubKey, parser) => {
        let id;
        if (typeof pubKey === 'string') {
            id = new web3_js_1.PublicKey(pubKey);
        }
        else {
            id = pubKey;
        }
        const address = id.toBase58();
        let account = genericCache.get(address);
        if (account) {
            return account;
        }
        // Note: If the request to get the account fails the error is captured as a rejected Promise and would stay in pendingCalls forever
        // It means if the first request fails for a transient reason it would never recover from the state and account would never be returned
        // TODO: add logic to detect transient errors and remove the Promises from  pendingCalls
        let query = pendingCalls.get(address);
        if (query) {
            return query;
        }
        // TODO: refactor to use multiple accounts query with flush like behavior
        query = connection.getAccountInfo(id).then(data => {
            if (!data) {
                throw new Error(`Account ${id.toBase58()} not found`);
            }
            return exports.cache.add(id, data, parser);
        });
        pendingCalls.set(address, query);
        return query;
    },
    add: (id, obj, parser) => {
        if (obj.data.length === 0) {
            return;
        }
        const address = typeof id === 'string' ? id : id === null || id === void 0 ? void 0 : id.toBase58();
        const deserialize = parser ? parser : exports.keyToAccountParser.get(address);
        if (!deserialize) {
            throw new Error('Deserializer needs to be registered or passed as a parameter');
        }
        exports.cache.registerParser(id, deserialize);
        pendingCalls.delete(address);
        const account = deserialize(new web3_js_1.PublicKey(address), obj);
        if (!account) {
            return;
        }
        const isNew = !genericCache.has(address);
        genericCache.set(address, account);
        exports.cache.emitter.raiseCacheUpdated(address, isNew, deserialize);
        return account;
    },
    get: (pubKey) => {
        let key;
        if (typeof pubKey !== 'string') {
            key = pubKey.toBase58();
        }
        else {
            key = pubKey;
        }
        return genericCache.get(key);
    },
    delete: (pubKey) => {
        let key;
        if (typeof pubKey !== 'string') {
            key = pubKey.toBase58();
        }
        else {
            key = pubKey;
        }
        if (genericCache.get(key)) {
            genericCache.delete(key);
            exports.cache.emitter.raiseCacheDeleted(key);
            return true;
        }
        return false;
    },
    byParser: (parser) => {
        const result = [];
        for (const id of exports.keyToAccountParser.keys()) {
            if (exports.keyToAccountParser.get(id) === parser) {
                result.push(id);
            }
        }
        return result;
    },
    registerParser: (pubkey, parser) => {
        if (pubkey) {
            const address = typeof pubkey === 'string' ? pubkey : pubkey === null || pubkey === void 0 ? void 0 : pubkey.toBase58();
            exports.keyToAccountParser.set(address, parser);
        }
        return pubkey;
    },
    queryMint: async (connection, pubKey) => {
        let id;
        if (typeof pubKey === 'string') {
            id = new web3_js_1.PublicKey(pubKey);
        }
        else {
            id = pubKey;
        }
        const address = id.toBase58();
        let mint = mintCache.get(address);
        if (mint) {
            return mint;
        }
        // Note: If the request to get the mint  fails the error is captured as a rejected Promise and would stay in pendingMintCalls forever
        // It means if the first request fails for a transient reason it would never recover from the state and mint would never be returned
        // TODO: add logic to detect transient errors and remove the Promises from  pendingMintCalls
        let query = pendingMintCalls.get(address);
        if (query) {
            return query;
        }
        query = getMintInfo(connection, id).then(data => {
            pendingMintCalls.delete(address);
            mintCache.set(address, data);
            return data;
        });
        pendingMintCalls.set(address, query);
        return query;
    },
    getMint: (pubKey) => {
        let key;
        if (typeof pubKey !== 'string') {
            key = pubKey.toBase58();
        }
        else {
            key = pubKey;
        }
        return mintCache.get(key);
    },
    addMint: (pubKey, obj) => {
        const mint = exports.deserializeMint(obj.data);
        const id = pubKey.toBase58();
        mintCache.set(id, mint);
        return mint;
    },
};
const useAccountsContext = () => {
    const context = react_1.useContext(AccountsContext);
    return context;
};
exports.useAccountsContext = useAccountsContext;
function wrapNativeAccount(pubkey, account) {
    if (!account) {
        return undefined;
    }
    return {
        pubkey: pubkey,
        account,
        info: {
            mint: ids_1.WRAPPED_SOL_MINT,
            owner: pubkey,
            amount: new spl_token_1.u64(account.lamports),
            delegate: null,
            delegatedAmount: new spl_token_1.u64(0),
            isInitialized: true,
            isFrozen: false,
            isNative: true,
            rentExemptReserve: null,
            closeAuthority: null,
        },
    };
}
const getCachedAccount = (predicate) => {
    for (const account of genericCache.values()) {
        if (predicate(account)) {
            return account;
        }
    }
};
exports.getCachedAccount = getCachedAccount;
const UseNativeAccount = () => {
    const connection = connection_1.useConnection();
    const { wallet } = wallet_1.useWallet();
    const [nativeAccount, setNativeAccount] = react_1.useState();
    const updateCache = react_1.useCallback(account => {
        var _a;
        if (wallet && wallet.publicKey) {
            const wrapped = wrapNativeAccount(wallet.publicKey, account);
            if (wrapped !== undefined && wallet) {
                const id = (_a = wallet.publicKey) === null || _a === void 0 ? void 0 : _a.toBase58();
                exports.cache.registerParser(id, exports.TokenAccountParser);
                genericCache.set(id, wrapped);
                exports.cache.emitter.raiseCacheUpdated(id, false, exports.TokenAccountParser);
            }
        }
    }, [wallet]);
    react_1.useEffect(() => {
        let subId = 0;
        const updateAccount = (account) => {
            if (account) {
                updateCache(account);
                setNativeAccount(account);
            }
        };
        (async () => {
            if (!connection || !(wallet === null || wallet === void 0 ? void 0 : wallet.publicKey)) {
                return;
            }
            const account = await connection.getAccountInfo(wallet.publicKey);
            updateAccount(account);
            subId = connection.onAccountChange(wallet.publicKey, updateAccount);
        })();
        return () => {
            if (subId) {
                connection.removeAccountChangeListener(subId);
            }
        };
    }, [setNativeAccount, wallet, wallet === null || wallet === void 0 ? void 0 : wallet.publicKey, connection, updateCache]);
    return { nativeAccount };
};
const PRECACHED_OWNERS = new Set();
const precacheUserTokenAccounts = async (connection, owner) => {
    if (!owner) {
        return;
    }
    // used for filtering account updates over websocket
    PRECACHED_OWNERS.add(owner.toBase58());
    // user accounts are updated via ws subscription
    const accounts = await connection.getTokenAccountsByOwner(owner, {
        programId: ids_1.programIds().token,
    });
    accounts.value.forEach(info => {
        exports.cache.add(info.pubkey.toBase58(), info.account, exports.TokenAccountParser);
    });
};
function AccountsProvider({ children = null }) {
    const connection = connection_1.useConnection();
    const { wallet, connected } = wallet_1.useWallet();
    const [tokenAccounts, setTokenAccounts] = react_1.useState([]);
    const [userAccounts, setUserAccounts] = react_1.useState([]);
    const { nativeAccount } = UseNativeAccount();
    const selectUserAccounts = react_1.useCallback(() => {
        return exports.cache
            .byParser(exports.TokenAccountParser)
            .map(id => exports.cache.get(id))
            .filter(a => { var _a; return a && a.info.owner.toBase58() === ((_a = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey) === null || _a === void 0 ? void 0 : _a.toBase58()); })
            .map(a => a);
    }, [wallet]);
    react_1.useEffect(() => {
        const accounts = selectUserAccounts().filter(a => a !== undefined);
        setUserAccounts(accounts);
    }, [nativeAccount, wallet, tokenAccounts, selectUserAccounts]);
    react_1.useEffect(() => {
        const subs = [];
        exports.cache.emitter.onCache(args => {
            if (args.isNew) {
                let id = args.id;
                let deserialize = args.parser;
                connection.onAccountChange(new web3_js_1.PublicKey(id), info => {
                    exports.cache.add(id, info, deserialize);
                });
            }
        });
        return () => {
            subs.forEach(id => connection.removeAccountChangeListener(id));
        };
    }, [connection]);
    const publicKey = wallet === null || wallet === void 0 ? void 0 : wallet.publicKey;
    react_1.useEffect(() => {
        if (!connection || !publicKey) {
            setTokenAccounts([]);
        }
        else {
            precacheUserTokenAccounts(connection, ids_1.LEND_HOST_FEE_ADDRESS);
            precacheUserTokenAccounts(connection, publicKey).then(() => {
                setTokenAccounts(selectUserAccounts());
            });
            // This can return different types of accounts: token-account, mint, multisig
            // TODO: web3.js expose ability to filter.
            // this should use only filter syntax to only get accounts that are owned by user
            const tokenSubID = connection.onProgramAccountChange(ids_1.programIds().token, info => {
                // TODO: fix type in web3.js
                const id = info.accountId;
                // TODO: do we need a better way to identify layout (maybe a enum identifing type?)
                if (info.accountInfo.data.length === spl_token_1.AccountLayout.span) {
                    const data = exports.deserializeAccount(info.accountInfo.data);
                    if (PRECACHED_OWNERS.has(data.owner.toBase58())) {
                        exports.cache.add(id, info.accountInfo, exports.TokenAccountParser);
                        setTokenAccounts(selectUserAccounts());
                    }
                }
            }, 'singleGossip');
            return () => {
                connection.removeProgramAccountChangeListener(tokenSubID);
            };
        }
    }, [connection, connected, publicKey, selectUserAccounts]);
    return (react_1.default.createElement(AccountsContext.Provider, { value: {
            userAccounts,
            nativeAccount,
        } }, children));
}
exports.AccountsProvider = AccountsProvider;
function useNativeAccount() {
    const context = react_1.useContext(AccountsContext);
    return {
        account: context.nativeAccount,
    };
}
exports.useNativeAccount = useNativeAccount;
const getMultipleAccounts = async (connection, keys, commitment) => {
    const result = await Promise.all(utils_1.chunks(keys, 99).map(chunk => getMultipleAccountsCore(connection, chunk, commitment)));
    const array = result
        .map(a => a.array.map(acc => {
        if (!acc) {
            return undefined;
        }
        const { data, ...rest } = acc;
        const obj = {
            ...rest,
            data: Buffer.from(data[0], 'base64'),
        };
        return obj;
    }))
        .flat();
    return { keys, array };
};
exports.getMultipleAccounts = getMultipleAccounts;
const getMultipleAccountsCore = async (connection, keys, commitment) => {
    const args = connection._buildArgs([keys], commitment, 'base64');
    const unsafeRes = await connection._rpcRequest('getMultipleAccounts', args);
    if (unsafeRes.error) {
        throw new Error('failed to get info about account ' + unsafeRes.error.message);
    }
    if (unsafeRes.result.value) {
        const array = unsafeRes.result.value;
        return { keys, array };
    }
    // TODO: fix
    throw new Error();
};
function useMint(key) {
    const connection = connection_1.useConnection();
    const [mint, setMint] = react_1.useState();
    const id = typeof key === 'string' ? key : key === null || key === void 0 ? void 0 : key.toBase58();
    react_1.useEffect(() => {
        if (!id) {
            return;
        }
        exports.cache
            .query(connection, id, exports.MintParser)
            .then(acc => setMint(acc.info))
            .catch(err => console.log(err));
        const dispose = exports.cache.emitter.onCache(e => {
            const event = e;
            if (event.id === id) {
                exports.cache
                    .query(connection, id, exports.MintParser)
                    .then(mint => setMint(mint.info));
            }
        });
        return () => {
            dispose();
        };
    }, [connection, id]);
    return mint;
}
exports.useMint = useMint;
function useAccount(pubKey) {
    const connection = connection_1.useConnection();
    const [account, setAccount] = react_1.useState();
    const key = pubKey === null || pubKey === void 0 ? void 0 : pubKey.toBase58();
    react_1.useEffect(() => {
        const query = async () => {
            try {
                if (!key) {
                    return;
                }
                const acc = await exports.cache
                    .query(connection, key, exports.TokenAccountParser)
                    .catch(err => console.log(err));
                if (acc) {
                    setAccount(acc);
                }
            }
            catch (err) {
                console.error(err);
            }
        };
        query();
        const dispose = exports.cache.emitter.onCache(e => {
            const event = e;
            if (event.id === key) {
                query();
            }
        });
        return () => {
            dispose();
        };
    }, [connection, key]);
    return account;
}
exports.useAccount = useAccount;
// TODO: expose in spl package
const deserializeAccount = (data) => {
    const accountInfo = spl_token_1.AccountLayout.decode(data);
    accountInfo.mint = new web3_js_1.PublicKey(accountInfo.mint);
    accountInfo.owner = new web3_js_1.PublicKey(accountInfo.owner);
    accountInfo.amount = spl_token_1.u64.fromBuffer(accountInfo.amount);
    if (accountInfo.delegateOption === 0) {
        accountInfo.delegate = null;
        accountInfo.delegatedAmount = new spl_token_1.u64(0);
    }
    else {
        accountInfo.delegate = new web3_js_1.PublicKey(accountInfo.delegate);
        accountInfo.delegatedAmount = spl_token_1.u64.fromBuffer(accountInfo.delegatedAmount);
    }
    accountInfo.isInitialized = accountInfo.state !== 0;
    accountInfo.isFrozen = accountInfo.state === 2;
    if (accountInfo.isNativeOption === 1) {
        accountInfo.rentExemptReserve = spl_token_1.u64.fromBuffer(accountInfo.isNative);
        accountInfo.isNative = true;
    }
    else {
        accountInfo.rentExemptReserve = null;
        accountInfo.isNative = false;
    }
    if (accountInfo.closeAuthorityOption === 0) {
        accountInfo.closeAuthority = null;
    }
    else {
        accountInfo.closeAuthority = new web3_js_1.PublicKey(accountInfo.closeAuthority);
    }
    return accountInfo;
};
exports.deserializeAccount = deserializeAccount;
// TODO: expose in spl package
const deserializeMint = (data) => {
    if (data.length !== spl_token_1.MintLayout.span) {
        throw new Error('Not a valid Mint');
    }
    const mintInfo = spl_token_1.MintLayout.decode(data);
    if (mintInfo.mintAuthorityOption === 0) {
        mintInfo.mintAuthority = null;
    }
    else {
        mintInfo.mintAuthority = new web3_js_1.PublicKey(mintInfo.mintAuthority);
    }
    mintInfo.supply = spl_token_1.u64.fromBuffer(mintInfo.supply);
    mintInfo.isInitialized = mintInfo.isInitialized !== 0;
    if (mintInfo.freezeAuthorityOption === 0) {
        mintInfo.freezeAuthority = null;
    }
    else {
        mintInfo.freezeAuthority = new web3_js_1.PublicKey(mintInfo.freezeAuthority);
    }
    return mintInfo;
};
exports.deserializeMint = deserializeMint;
//# sourceMappingURL=accounts.js.map