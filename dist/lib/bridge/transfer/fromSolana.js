"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSolana = void 0;
const utils_1 = require("./../../common/dist/lib/utils/utils");
const ids_1 = require("./../../common/dist/lib/utils/ids");
const connection_1 = require("./../../common/dist/lib/contexts/connection");
const WormholeFactory_1 = require("../../contracts/WormholeFactory");
const helpers_1 = require("./../helpers");
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const bn_js_1 = __importDefault(require("bn.js"));
const lock_1 = require("../lock");
const transferOutProposal_1 = require("../transferOutProposal");
const fromSolana = async (connection, wallet, request, provider, setProgress, bridge) => {
    if (!request.asset ||
        !request.amount ||
        !request.to ||
        !request.info ||
        !bridge) {
        return;
    }
    const signer = provider === null || provider === void 0 ? void 0 : provider.getSigner();
    request.recipient = Buffer.from((await signer.getAddress()).slice(2), 'hex');
    const nonce = await provider.getTransactionCount(signer.getAddress(), 'pending');
    let counter = 0;
    // check difference between lock/approve (invoke lock if allowance < amount)
    const steps = {
        transfer: async (request) => {
            if (!request.info) {
                throw new Error('Missing info');
            }
            if (!request.amount) {
                throw new Error('Missing amount');
            }
            return steps.lock(request);
        },
        // locks assets in the bridge
        lock: async (request) => {
            var _a;
            if (!request.amount ||
                !request.recipient ||
                !request.to ||
                !request.info ||
                !wallet.publicKey) {
                return;
            }
            let group = 'Initiate transfer';
            const programs = ids_1.programIds();
            const bridgeId = programs.wormhole.pubkey;
            const authorityKey = await helpers_1.bridgeAuthorityKey(bridgeId);
            const precision = Math.pow(10, ((_a = request.info) === null || _a === void 0 ? void 0 : _a.decimals) || 0);
            const amount = Math.floor(request.amount * precision);
            let { ix: lock_ix, transferKey } = await lock_1.createLockAssetInstruction(authorityKey, wallet.publicKey, new web3_js_1.PublicKey(request.info.address), new web3_js_1.PublicKey(request.info.mint), new bn_js_1.default(amount), request.to, request.recipient, {
                chain: request.info.chainID,
                address: request.info.assetAddress,
                decimals: request.info.decimals,
            }, 
            // TODO: should this is use durable nonce account?
            Math.random() * 100000);
            let ix = spl_token_1.Token.createApproveInstruction(programs.token, new web3_js_1.PublicKey(request.info.address), authorityKey, wallet.publicKey, [], amount);
            setProgress({
                message: 'Waiting for Solana approval...',
                type: 'user',
                group,
                step: counter++,
            });
            let fee_ix = web3_js_1.SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: authorityKey,
                lamports: await getTransferFee(connection),
            });
            const { slot } = await connection_1.sendTransactionWithRetry(connection, wallet, [ix, fee_ix, lock_ix], [], undefined, false, undefined, () => {
                setProgress({
                    message: 'Executing Solana Transaction',
                    type: 'wait',
                    group,
                    step: counter++,
                });
            });
            return steps.wait(request, transferKey, slot);
        },
        wait: async (request, proposalKey, slot) => {
            return new Promise((resolve, reject) => {
                let completed = false;
                let unsubscribed = false;
                let startSlot = slot;
                let group = 'Lock assets';
                const solConfirmationMessage = (current) => `Awaiting Solana confirmations: ${current} out of 32`;
                let replaceMessage = false;
                let slotUpdateListener = connection.onSlotChange(slot => {
                    if (unsubscribed) {
                        return;
                    }
                    const passedSlots = Math.min(Math.max(slot.slot - startSlot, 0), 32);
                    const isLast = passedSlots - 1 === 31;
                    if (passedSlots <= 32) {
                        setProgress({
                            message: solConfirmationMessage(passedSlots),
                            type: isLast ? 'done' : 'wait',
                            step: counter++,
                            group,
                            replace: replaceMessage,
                        });
                        replaceMessage = true;
                    }
                    if (completed || isLast) {
                        unsubscribed = true;
                        setProgress({
                            message: 'Awaiting guardian confirmation. (Up to few min.)',
                            type: 'wait',
                            step: counter++,
                            group,
                        });
                    }
                });
                let accountChangeListener = connection.onAccountChange(proposalKey, async (a) => {
                    if (completed)
                        return;
                    let lockup = transferOutProposal_1.TransferOutProposalLayout.decode(a.data);
                    let vaa = lockup.vaa;
                    for (let i = vaa.length; i > 0; i--) {
                        if (vaa[i] == 0xff) {
                            vaa = vaa.slice(0, i);
                            break;
                        }
                    }
                    // Probably a poke
                    if (vaa.filter((v) => v !== 0).length == 0) {
                        return;
                    }
                    completed = true;
                    connection.removeAccountChangeListener(accountChangeListener);
                    connection.removeSlotChangeListener(slotUpdateListener);
                    let signatures;
                    while (!signatures) {
                        try {
                            signatures = await bridge.fetchSignatureStatus(lockup.signatureAccount);
                            break;
                        }
                        catch {
                            await utils_1.sleep(500);
                        }
                    }
                    let sigData = Buffer.of(...signatures.reduce((previousValue, currentValue) => {
                        previousValue.push(currentValue.index);
                        previousValue.push(...currentValue.signature);
                        return previousValue;
                    }, new Array()));
                    vaa = Buffer.concat([
                        vaa.slice(0, 5),
                        Buffer.of(signatures.length),
                        sigData,
                        vaa.slice(6),
                    ]);
                    try {
                        await steps.postVAA(request, vaa);
                        resolve();
                    }
                    catch {
                        reject();
                    }
                }, 'single');
            });
        },
        postVAA: async (request, vaa) => {
            let wh = WormholeFactory_1.WormholeFactory.connect(ids_1.programIds().wormhole.bridge, signer);
            let group = 'Finalizing transfer';
            setProgress({
                message: 'Sign the claim...',
                type: 'wait',
                group,
                step: counter++,
            });
            let tx = await wh.submitVAA(vaa);
            setProgress({
                message: 'Waiting for tokens unlock to be mined... (Up to few min.)',
                type: 'wait',
                group,
                step: counter++,
            });
            await tx.wait(1);
            setProgress({
                message: 'Execution of VAA succeeded',
                type: 'done',
                group,
                step: counter++,
            });
            //message.success({content: "", key: "eth_tx"})
        },
    };
    return steps.transfer(request);
};
exports.fromSolana = fromSolana;
const getTransferFee = async (connection) => {
    // claim + signature
    // Reference processor.rs::Bridge::transfer_fee
    return ((await connection.getMinimumBalanceForRentExemption((40 + 1340) * 2)) +
        18 * 10000 * 2);
};
//# sourceMappingURL=fromSolana.js.map