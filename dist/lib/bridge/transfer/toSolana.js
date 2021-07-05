"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSolana = void 0;
const account_1 = require("./../../common/dist/lib/actions/account");
const connection_1 = require("./../../common/dist/lib/contexts/connection");
const accounts_1 = require("./../../common/dist/lib/contexts/accounts");
const ids_1 = require("./../../common/dist/lib/utils/ids");
const ethers_1 = require("ethers");
const ERC20Factory_1 = require("../../contracts/ERC20Factory");
const WormholeFactory_1 = require("../../contracts/WormholeFactory");
const meta_1 = require("./../meta");
const helpers_1 = require("./../helpers");
const web3_js_1 = require("@solana/web3.js");
const bignumber_js_1 = require("bignumber.js");
const toSolana = async (connection, wallet, request, provider, setProgress) => {
    if (!request.asset || !request.amount || !request.info) {
        return;
    }
    const walletName = 'MetaMask';
    const signer = provider === null || provider === void 0 ? void 0 : provider.getSigner();
    const nonce = await provider.getTransactionCount(signer.getAddress(), 'pending');
    const amountBigNumber = new bignumber_js_1.BigNumber(request.amount.toString()).toFormat(request.info.decimals);
    const amountBN = ethers_1.ethers.utils.parseUnits(request.amount.toString(), request.info.decimals);
    let counter = 0;
    // check difference between lock/approve (invoke lock if allowance < amount)
    const steps = {
        transfer: async (request) => {
            if (!request.info || !request.amount) {
                return;
            }
            return steps.prepare(request);
        },
        // creates wrapped account on solana
        prepare: async (request) => {
            var _a, _b;
            if (!request.info || !request.from || !wallet.publicKey) {
                return;
            }
            const group = 'Initiate transfer';
            try {
                const bridgeId = ids_1.programIds().wormhole.pubkey;
                const authority = await helpers_1.bridgeAuthorityKey(bridgeId);
                const meta = {
                    decimals: Math.min((_a = request.info) === null || _a === void 0 ? void 0 : _a.decimals, 9),
                    address: (_b = request.info) === null || _b === void 0 ? void 0 : _b.assetAddress,
                    chain: request.from,
                };
                const mintKey = await helpers_1.wrappedAssetMintKey(bridgeId, authority, meta);
                const recipientKey = accounts_1.cache
                    .byParser(accounts_1.TokenAccountParser)
                    .map(key => {
                    let account = accounts_1.cache.get(key);
                    if ((account === null || account === void 0 ? void 0 : account.info.mint.toBase58()) === mintKey.toBase58()) {
                        return key;
                    }
                    return;
                })
                    .find(_ => _) || '';
                const recipient = recipientKey
                    ? new web3_js_1.PublicKey(recipientKey)
                    : (await web3_js_1.PublicKey.findProgramAddress([
                        wallet.publicKey.toBuffer(),
                        ids_1.programIds().token.toBuffer(),
                        mintKey.toBuffer(),
                    ], ids_1.programIds().associatedToken))[0];
                request.recipient = recipient.toBuffer();
                const accounts = await accounts_1.getMultipleAccounts(connection, [mintKey.toBase58(), recipient.toBase58()], 'single');
                const instructions = [];
                const signers = [];
                if (!accounts.array[0]) {
                    // create mint using wormhole instruction
                    instructions.push(await meta_1.createWrappedAssetInstruction(meta, bridgeId, authority, mintKey, wallet.publicKey));
                }
                if (!accounts.array[1]) {
                    account_1.createAssociatedTokenAccountInstruction(instructions, recipient, wallet.publicKey, wallet.publicKey, mintKey);
                }
                if (instructions.length > 0) {
                    setProgress({
                        message: 'Waiting for Solana approval...',
                        type: 'user',
                        group,
                        step: counter++,
                    });
                    await connection_1.sendTransactionWithRetry(connection, wallet, instructions, signers);
                }
            }
            catch (err) {
                setProgress({
                    message: `Couldn't create Solana account!`,
                    type: 'error',
                    group,
                    step: counter++,
                });
                throw err;
            }
            return steps.approve(request);
        },
        // approves assets for transfer
        approve: async (request) => {
            var _a;
            if (!request.asset) {
                return;
            }
            const group = 'Approve assets';
            try {
                if ((_a = request.info) === null || _a === void 0 ? void 0 : _a.allowance.lt(amountBN)) {
                    let e = ERC20Factory_1.ERC20Factory.connect(request.asset, signer);
                    setProgress({
                        message: `Waiting for ${walletName} approval`,
                        type: 'user',
                        group,
                        step: counter++,
                    });
                    let res = await e.approve(ids_1.programIds().wormhole.bridge, amountBN);
                    setProgress({
                        message: 'Waiting for ETH transaction to be mined... (Up to few min.)',
                        type: 'wait',
                        group,
                        step: counter++,
                    });
                    await res.wait(1);
                    setProgress({
                        message: 'Approval on ETH succeeded!',
                        type: 'done',
                        group,
                        step: counter++,
                    });
                }
                else {
                    setProgress({
                        message: 'Already approved on ETH!',
                        type: 'done',
                        group,
                        step: counter++,
                    });
                }
            }
            catch (err) {
                setProgress({
                    message: 'Approval failed!',
                    type: 'error',
                    group,
                    step: counter++,
                });
                throw err;
            }
            return steps.lock(request);
        },
        // locks assets in the bridge
        lock: async (request) => {
            if (!amountBN ||
                !request.asset ||
                !request.recipient ||
                !request.to ||
                !request.info) {
                return;
            }
            let group = 'Lock assets';
            try {
                let wh = WormholeFactory_1.WormholeFactory.connect(ids_1.programIds().wormhole.bridge, signer);
                setProgress({
                    message: `Waiting for ${walletName} transfer approval`,
                    type: 'user',
                    group,
                    step: counter++,
                });
                let res = await wh.lockAssets(request.asset, amountBN, request.recipient, request.to, nonce, false);
                setProgress({
                    message: 'Waiting for ETH transaction to be mined... (Up to few min.)',
                    type: 'wait',
                    group,
                    step: counter++,
                });
                await res.wait(1);
                setProgress({
                    message: 'Transfer on ETH succeeded!',
                    type: 'done',
                    group,
                    step: counter++,
                });
            }
            catch (err) {
                setProgress({
                    message: 'Transfer failed!',
                    type: 'error',
                    group,
                    step: counter++,
                });
                throw err;
            }
            return steps.wait(request);
        },
        wait: async (request) => {
            let startBlock = provider.blockNumber;
            let completed = false;
            let group = 'Finalizing transfer';
            const ethConfirmationMessage = (current) => `Awaiting ETH confirmations: ${current} out of 15`;
            setProgress({
                message: ethConfirmationMessage(0),
                type: 'wait',
                step: counter++,
                group,
            });
            let blockHandler = (blockNumber) => {
                let passedBlocks = blockNumber - startBlock;
                const isLast = passedBlocks === 14;
                if (passedBlocks < 15) {
                    setProgress({
                        message: ethConfirmationMessage(passedBlocks),
                        type: isLast ? 'done' : 'wait',
                        step: counter++,
                        group,
                        replace: passedBlocks > 0,
                    });
                    if (isLast) {
                        setProgress({
                            message: 'Awaiting completion on Solana...',
                            type: 'wait',
                            group,
                            step: counter++,
                        });
                    }
                }
                else if (!completed) {
                    provider.removeListener('block', blockHandler);
                }
            };
            provider.on('block', blockHandler);
            return new Promise((resolve, reject) => {
                if (!request.recipient) {
                    return;
                }
                let accountChangeListener = connection.onAccountChange(new web3_js_1.PublicKey(request.recipient), () => {
                    if (completed)
                        return;
                    completed = true;
                    provider.removeListener('block', blockHandler);
                    connection.removeAccountChangeListener(accountChangeListener);
                    setProgress({
                        message: 'Transfer completed on Solana',
                        type: 'info',
                        group,
                        step: counter++,
                    });
                    resolve();
                }, 'single');
            });
        },
    };
    return steps.transfer(request);
};
exports.toSolana = toSolana;
//# sourceMappingURL=toSolana.js.map