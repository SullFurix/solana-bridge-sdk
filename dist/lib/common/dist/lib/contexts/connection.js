"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
}) : (function (o, m, k, k2) {
    if (k2 === undefined)
        k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function (o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function (o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule)
        return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSignedTransaction = exports.getUnixTs = exports.sendTransactionWithRetry = exports.sendTransaction = exports.sendTransactions = exports.SequenceType = exports.getErrorForTransaction = exports.useSlippageConfig = exports.useConnectionConfig = exports.useSendConnection = exports.useConnection = exports.ConnectionProvider = exports.ENDPOINTS = void 0;
const utils_1 = require("../utils/utils");
const web3_js_1 = require("@solana/web3.js");
const react_1 = __importStar(require("react"));
const notifications_1 = require("../utils/notifications");
const ExplorerLink_1 = require("../components/ExplorerLink");
const ids_1 = require("../utils/ids");
const spl_token_registry_1 = require("@solana/spl-token-registry");
const errors_1 = require("../utils/errors");
exports.ENDPOINTS = [
    {
        name: 'mainnet-beta (Serum)',
        endpoint: 'https://solana-api.projectserum.com/',
        ChainId: spl_token_registry_1.ENV.MainnetBeta,
    },
    {
        name: 'mainnet-beta',
        endpoint: 'https://api.mainnet-beta.solana.com',
        ChainId: spl_token_registry_1.ENV.MainnetBeta,
    },
    {
        name: 'testnet',
        endpoint: web3_js_1.clusterApiUrl('testnet'),
        ChainId: spl_token_registry_1.ENV.Testnet,
    },
    {
        name: 'devnet',
        endpoint: 'https://api.devnet.solana.com',
        ChainId: spl_token_registry_1.ENV.Devnet,
    },
    {
        name: 'localnet',
        endpoint: 'http://127.0.0.1:8899',
        ChainId: spl_token_registry_1.ENV.Devnet,
    },
    {
        name: 'Oyster Dev',
        endpoint: 'http://oyster-dev.solana.com/',
        ChainId: spl_token_registry_1.ENV.Devnet,
    },
    {
        name: 'Lending',
        endpoint: 'https://tln.solana.com/',
        ChainId: spl_token_registry_1.ENV.Devnet,
    },
];
const DEFAULT = exports.ENDPOINTS[0].endpoint;
const DEFAULT_SLIPPAGE = 0.25;
const ConnectionContext = react_1.default.createContext({
    endpoint: DEFAULT,
    setEndpoint: () => { },
    slippage: DEFAULT_SLIPPAGE,
    setSlippage: (val) => { },
    connection: new web3_js_1.Connection(DEFAULT, 'recent'),
    sendConnection: new web3_js_1.Connection(DEFAULT, 'recent'),
    env: exports.ENDPOINTS[0].name,
    tokens: [],
    tokenMap: new Map(),
});
function ConnectionProvider({ children = undefined }) {
    var _a;
    const [endpoint, setEndpoint] = utils_1.useLocalStorageState('connectionEndpoint', exports.ENDPOINTS[0].endpoint);
    const [slippage, setSlippage] = utils_1.useLocalStorageState('slippage', DEFAULT_SLIPPAGE.toString());
    const connection = react_1.useMemo(() => new web3_js_1.Connection(endpoint, 'recent'), [endpoint]);
    const sendConnection = react_1.useMemo(() => new web3_js_1.Connection(endpoint, 'recent'), [endpoint]);
    const env = ((_a = exports.ENDPOINTS.find(end => end.endpoint === endpoint)) === null || _a === void 0 ? void 0 : _a.name) || exports.ENDPOINTS[0].name;
    const [tokens, setTokens] = react_1.useState([]);
    const [tokenMap, setTokenMap] = react_1.useState(new Map());
    react_1.useEffect(() => {
        // fetch token files
        new spl_token_registry_1.TokenListProvider().resolve().then(container => {
            var _a;
            const list = container
                .excludeByTag('nft')
                .filterByChainId(((_a = exports.ENDPOINTS.find(end => end.endpoint === endpoint)) === null || _a === void 0 ? void 0 : _a.ChainId) ||
                spl_token_registry_1.ENV.MainnetBeta)
                .getList();
            const knownMints = [...list].reduce((map, item) => {
                map.set(item.address, item);
                return map;
            }, new Map());
            setTokenMap(knownMints);
            setTokens(list);
        });
    }, [env]);
    ids_1.setProgramIds(env);
    // The websocket library solana/web3.js uses closes its websocket connection when the subscription list
    // is empty after opening its first time, preventing subsequent subscriptions from receiving responses.
    // This is a hack to prevent the list from every getting empty
    react_1.useEffect(() => {
        const id = connection.onAccountChange(new web3_js_1.Account().publicKey, () => { });
        return () => {
            connection.removeAccountChangeListener(id);
        };
    }, [connection]);
    react_1.useEffect(() => {
        const id = connection.onSlotChange(() => null);
        return () => {
            connection.removeSlotChangeListener(id);
        };
    }, [connection]);
    react_1.useEffect(() => {
        const id = sendConnection.onAccountChange(new web3_js_1.Account().publicKey, () => { });
        return () => {
            sendConnection.removeAccountChangeListener(id);
        };
    }, [sendConnection]);
    react_1.useEffect(() => {
        const id = sendConnection.onSlotChange(() => null);
        return () => {
            sendConnection.removeSlotChangeListener(id);
        };
    }, [sendConnection]);
    return (react_1.default.createElement(ConnectionContext.Provider, { value: {
            endpoint,
            setEndpoint,
            slippage: parseFloat(slippage),
            setSlippage: val => setSlippage(val.toString()),
            connection,
            sendConnection,
            tokens,
            tokenMap,
            env,
        } }, children));
}
exports.ConnectionProvider = ConnectionProvider;
function useConnection() {
    return react_1.useContext(ConnectionContext).connection;
}
exports.useConnection = useConnection;
function useSendConnection() {
    var _a;
    return (_a = react_1.useContext(ConnectionContext)) === null || _a === void 0 ? void 0 : _a.sendConnection;
}
exports.useSendConnection = useSendConnection;
function useConnectionConfig() {
    const context = react_1.useContext(ConnectionContext);
    return {
        endpoint: context.endpoint,
        setEndpoint: context.setEndpoint,
        env: context.env,
        tokens: context.tokens,
        tokenMap: context.tokenMap,
    };
}
exports.useConnectionConfig = useConnectionConfig;
function useSlippageConfig() {
    const { slippage, setSlippage } = react_1.useContext(ConnectionContext);
    return { slippage, setSlippage };
}
exports.useSlippageConfig = useSlippageConfig;
const getErrorForTransaction = async (connection, txid) => {
    // wait for all confirmation before geting transaction
    await connection.confirmTransaction(txid, 'max');
    const tx = await connection.getParsedConfirmedTransaction(txid);
    const errors = [];
    if ((tx === null || tx === void 0 ? void 0 : tx.meta) && tx.meta.logMessages) {
        tx.meta.logMessages.forEach(log => {
            const regex = /Error: (.*)/gm;
            let m;
            while ((m = regex.exec(log)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                if (m.length > 1) {
                    errors.push(m[1]);
                }
            }
        });
    }
    return errors;
};
exports.getErrorForTransaction = getErrorForTransaction;
var SequenceType;
(function (SequenceType) {
    SequenceType[SequenceType["Sequential"] = 0] = "Sequential";
    SequenceType[SequenceType["Parallel"] = 1] = "Parallel";
    SequenceType[SequenceType["StopOnFailure"] = 2] = "StopOnFailure";
})(SequenceType = exports.SequenceType || (exports.SequenceType = {}));
const sendTransactions = async (connection, wallet, instructionSet, signersSet, sequenceType = SequenceType.Parallel, commitment = 'singleGossip', successCallback = (txid, ind) => { }, failCallback = (txid, ind) => false, block) => {
    const unsignedTxns = [];
    if (!block) {
        block = await connection.getRecentBlockhash(commitment);
    }
    for (let i = 0; i < instructionSet.length; i++) {
        const instructions = instructionSet[i];
        const signers = signersSet[i];
        if (instructions.length === 0) {
            continue;
        }
        let transaction = new web3_js_1.Transaction();
        instructions.forEach(instruction => transaction.add(instruction));
        transaction.recentBlockhash = block.blockhash;
        transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey, ...signers.map(s => s.publicKey));
        if (signers.length > 0) {
            transaction.partialSign(...signers);
        }
        unsignedTxns.push(transaction);
    }
    const signedTxns = await wallet.signAllTransactions(unsignedTxns);
    const pendingTxns = [];
    let breakEarlyObject = { breakEarly: false };
    for (let i = 0; i < signedTxns.length; i++) {
        const signedTxnPromise = sendSignedTransaction({
            connection,
            signedTransaction: signedTxns[i],
        });
        signedTxnPromise
            .then(({ txid, slot }) => {
            successCallback(txid, i);
        })
            .catch(reason => {
            failCallback(signedTxns[i], i);
            if (sequenceType == SequenceType.StopOnFailure) {
                breakEarlyObject.breakEarly = true;
            }
        });
        if (sequenceType != SequenceType.Parallel) {
            await signedTxnPromise;
            if (breakEarlyObject.breakEarly) {
                return i; // REturn the txn we failed on by index
            }
        }
        else {
            pendingTxns.push(signedTxnPromise);
        }
    }
    if (sequenceType != SequenceType.Parallel) {
        await Promise.all(pendingTxns);
    }
    return signedTxns.length;
};
exports.sendTransactions = sendTransactions;
const sendTransaction = async (connection, wallet, instructions, signers, awaitConfirmation = true, commitment = 'singleGossip', includesFeePayer = false, block) => {
    let transaction = new web3_js_1.Transaction();
    instructions.forEach(instruction => transaction.add(instruction));
    transaction.recentBlockhash = (block || (await connection.getRecentBlockhash(commitment))).blockhash;
    if (includesFeePayer) {
        transaction.setSigners(...signers.map(s => s.publicKey));
    }
    else {
        transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey, ...signers.map(s => s.publicKey));
    }
    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
        try {
            transaction = await wallet.signTransaction(transaction);
        }
        catch (ex) {
            throw new errors_1.SignTransactionError(ex);
        }
    }
    const rawTransaction = transaction.serialize();
    let options = {
        skipPreflight: true,
        commitment,
    };
    const txid = await connection.sendRawTransaction(rawTransaction, options);
    let slot = 0;
    if (awaitConfirmation) {
        const confirmationStatus = await awaitTransactionSignatureConfirmation(txid, DEFAULT_TIMEOUT, connection, commitment);
        slot = (confirmationStatus === null || confirmationStatus === void 0 ? void 0 : confirmationStatus.slot) || 0;
        if (confirmationStatus === null || confirmationStatus === void 0 ? void 0 : confirmationStatus.err) {
            let errors = [];
            try {
                // TODO: This call always throws errors and delays error feedback
                //       It needs to be investigated but for now I'm commenting it out
                // errors = await getErrorForTransaction(connection, txid);
            }
            catch (ex) {
                console.error('getErrorForTransaction() error', ex);
            }
            notifications_1.notify({
                message: 'Transaction error',
                description: (react_1.default.createElement(react_1.default.Fragment, null, errors.map(err => (react_1.default.createElement("div", null, err))), react_1.default.createElement(ExplorerLink_1.ExplorerLink, { address: txid, type: "transaction", short: true, connection: connection }))),
                type: 'error',
            });
            throw new errors_1.SendTransactionError(`Transaction ${txid} failed (${JSON.stringify(confirmationStatus)})`, txid, confirmationStatus.err);
        }
    }
    return { txid, slot };
};
exports.sendTransaction = sendTransaction;
const sendTransactionWithRetry = async (connection, wallet, instructions, signers, commitment = 'singleGossip', includesFeePayer = false, block, beforeSend) => {
    let transaction = new web3_js_1.Transaction();
    instructions.forEach(instruction => transaction.add(instruction));
    transaction.recentBlockhash = (block || (await connection.getRecentBlockhash(commitment))).blockhash;
    if (includesFeePayer) {
        transaction.setSigners(...signers.map(s => s.publicKey));
    }
    else {
        transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey, ...signers.map(s => s.publicKey));
    }
    if (signers.length > 0) {
        transaction.partialSign(...signers);
    }
    if (!includesFeePayer) {
        transaction = await wallet.signTransaction(transaction);
    }
    if (beforeSend) {
        beforeSend();
    }
    const { txid, slot } = await sendSignedTransaction({
        connection,
        signedTransaction: transaction,
    });
    return { txid, slot };
};
exports.sendTransactionWithRetry = sendTransactionWithRetry;
const getUnixTs = () => {
    return new Date().getTime() / 1000;
};
exports.getUnixTs = getUnixTs;
const DEFAULT_TIMEOUT = 15000;
async function sendSignedTransaction({ signedTransaction, connection, timeout = DEFAULT_TIMEOUT, }) {
    const rawTransaction = signedTransaction.serialize();
    const startTime = exports.getUnixTs();
    let slot = 0;
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
    });
    console.log('Started awaiting confirmation for', txid);
    let done = false;
    (async () => {
        while (!done && exports.getUnixTs() - startTime < timeout) {
            connection.sendRawTransaction(rawTransaction, {
                skipPreflight: true,
            });
            await utils_1.sleep(500);
        }
    })();
    try {
        const confirmation = await awaitTransactionSignatureConfirmation(txid, timeout, connection, 'recent', true);
        if (confirmation.err) {
            console.error(confirmation.err);
            throw new Error('Transaction failed: Custom instruction error');
        }
        slot = (confirmation === null || confirmation === void 0 ? void 0 : confirmation.slot) || 0;
    }
    catch (err) {
        if (err.timeout) {
            throw new Error('Timed out awaiting confirmation on transaction');
        }
        let simulateResult = null;
        try {
            simulateResult = (await simulateTransaction(connection, signedTransaction, 'single')).value;
        }
        catch (e) { }
        if (simulateResult && simulateResult.err) {
            if (simulateResult.logs) {
                for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
                    const line = simulateResult.logs[i];
                    if (line.startsWith('Program log: ')) {
                        throw new Error('Transaction failed: ' + line.slice('Program log: '.length));
                    }
                }
            }
            throw new Error(JSON.stringify(simulateResult.err));
        }
        // throw new Error('Transaction failed');
    }
    finally {
        done = true;
    }
    console.log('Latency', txid, exports.getUnixTs() - startTime);
    return { txid, slot };
}
exports.sendSignedTransaction = sendSignedTransaction;
async function simulateTransaction(connection, transaction, commitment) {
    // @ts-ignore
    transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching);
    const signData = transaction.serializeMessage();
    // @ts-ignore
    const wireTransaction = transaction._serialize(signData);
    const encodedTransaction = wireTransaction.toString('base64');
    const config = { encoding: 'base64', commitment };
    const args = [encodedTransaction, config];
    // @ts-ignore
    const res = await connection._rpcRequest('simulateTransaction', args);
    if (res.error) {
        throw new Error('failed to simulate transaction: ' + res.error.message);
    }
    return res.result;
}
async function awaitTransactionSignatureConfirmation(txid, timeout, connection, commitment = 'recent', queryStatus = false) {
    let done = false;
    let status = {
        slot: 0,
        confirmations: 0,
        err: null,
    };
    let subId = 0;
    await new Promise((resolve, reject) => {
        (async () => {
            setTimeout(() => {
                if (done) {
                    return;
                }
                done = true;
                reject({ timeout: true });
            }, timeout);
            try {
                subId = connection.onSignature(txid, (result, context) => {
                    done = true;
                    status = {
                        err: result.err,
                        slot: context.slot,
                        confirmations: 0,
                    };
                    if (result.err) {
                        console.log('Rejected via websocket', result.err);
                        reject(result.err);
                    }
                    else {
                        console.log('Resolved via websocket', result);
                        resolve(result);
                    }
                }, commitment);
            }
            catch (e) {
                done = true;
                console.error('WS error in setup', txid, e);
            }
            while (!done && queryStatus) {
                // eslint-disable-next-line no-loop-func
                (async () => {
                    try {
                        const signatureStatuses = await connection.getSignatureStatuses([
                            txid,
                        ]);
                        status = signatureStatuses && signatureStatuses.value[0];
                        if (!done) {
                            if (!status) {
                                console.log('REST null result for', txid, status);
                            }
                            else if (status.err) {
                                console.log('REST error for', txid, status);
                                done = true;
                                reject(status.err);
                            }
                            else if (!status.confirmations) {
                                console.log('REST no confirmations for', txid, status);
                            }
                            else {
                                console.log('REST confirmation for', txid, status);
                                done = true;
                                resolve(status);
                            }
                        }
                    }
                    catch (e) {
                        if (!done) {
                            console.log('REST connection error: txid', txid, e);
                        }
                    }
                })();
                await utils_1.sleep(2000);
            }
        })();
    })
        .catch(err => {
        //@ts-ignore
        if (connection._signatureSubscriptions[subId])
            connection.removeSignatureListener(subId);
    })
        .then(_ => {
        //@ts-ignore
        if (connection._signatureSubscriptions[subId])
            connection.removeSignatureListener(subId);
    });
    done = true;
    return status;
}
//# sourceMappingURL=connection.js.map