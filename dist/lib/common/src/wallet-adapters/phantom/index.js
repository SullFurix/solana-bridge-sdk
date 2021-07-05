"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhantomWalletAdapter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const web3_js_1 = require("@solana/web3.js");
const notifications_1 = require("../../utils/notifications");
class PhantomWalletAdapter extends eventemitter3_1.default {
    constructor() {
        super();
        this.connect = async () => {
            var _a, _b;
            if (this._provider) {
                return;
            }
            let provider;
            if ((_b = (_a = window) === null || _a === void 0 ? void 0 : _a.solana) === null || _b === void 0 ? void 0 : _b.isPhantom) {
                provider = window.solana;
            }
            else {
                window.open('https://phantom.app/', '_blank');
                notifications_1.notify({
                    message: 'Phantom Error',
                    description: 'Please install Phantom wallet from Chrome ',
                });
                return;
            }
            provider.on('connect', () => {
                this._provider = provider;
                this.emit('connect');
            });
            if (!provider.isConnected) {
                await provider.connect();
            }
            this._provider = provider;
            this.emit('connect');
        };
        this.connect = this.connect.bind(this);
    }
    get connected() {
        var _a;
        return ((_a = this._provider) === null || _a === void 0 ? void 0 : _a.isConnected) || false;
    }
    get autoApprove() {
        var _a;
        return ((_a = this._provider) === null || _a === void 0 ? void 0 : _a.autoApprove) || false;
    }
    async signAllTransactions(transactions) {
        if (!this._provider) {
            return transactions;
        }
        return this._provider.signAllTransactions(transactions);
    }
    get publicKey() {
        var _a;
        // Due to weird phantom bug where their public key isnt quite like ours
        if (!this._cachedCorrectKey && ((_a = this._provider) === null || _a === void 0 ? void 0 : _a.publicKey))
            this._cachedCorrectKey = new web3_js_1.PublicKey(this._provider.publicKey.toBase58());
        return this._cachedCorrectKey || null;
    }
    async signTransaction(transaction) {
        if (!this._provider) {
            return transaction;
        }
        return this._provider.signTransaction(transaction);
    }
    disconnect() {
        if (this._provider) {
            this._provider.disconnect();
            this._provider = undefined;
            this.emit('disconnect');
        }
    }
}
exports.PhantomWalletAdapter = PhantomWalletAdapter;
//# sourceMappingURL=index.js.map