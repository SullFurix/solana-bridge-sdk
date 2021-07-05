"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MathWalletAdapter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const web3_js_1 = require("@solana/web3.js");
const notifications_1 = require("../../utils/notifications");
class MathWalletAdapter extends eventemitter3_1.default {
    constructor() {
        super();
        this._publicKey = null;
        this._onProcess = false;
        this._connected = false;
        this.connect = this.connect.bind(this);
    }
    get publicKey() {
        return this._publicKey;
    }
    get connected() {
        return this._connected;
    }
    get autoApprove() {
        return false;
    }
    // eslint-disable-next-line
    async signAllTransactions(transactions) {
        if (!this._provider) {
            return transactions;
        }
        return this._provider.signAllTransactions(transactions);
    }
    get _provider() {
        var _a, _b;
        if ((_b = (_a = window) === null || _a === void 0 ? void 0 : _a.solana) === null || _b === void 0 ? void 0 : _b.isMathWallet) {
            return window.solana;
        }
        return undefined;
    }
    signTransaction(transaction) {
        if (!this._provider) {
            return transaction;
        }
        return this._provider.signTransaction(transaction);
    }
    connect() {
        if (this._onProcess) {
            return;
        }
        if (!this._provider) {
            notifications_1.notify({
                message: 'MathWallet Error',
                description: 'Please install and initialize Math wallet extension from Chrome first',
            });
            return;
        }
        this._onProcess = true;
        this._provider
            .getAccount()
            .then((account) => {
            this._publicKey = new web3_js_1.PublicKey(account);
            this._connected = true;
            this.emit('connect', this._publicKey);
        })
            .catch(() => {
            this.disconnect();
        })
            .finally(() => {
            this._onProcess = false;
        });
    }
    disconnect() {
        if (this._publicKey) {
            this._publicKey = null;
            this._connected = false;
            this.emit('disconnect');
        }
    }
}
exports.MathWalletAdapter = MathWalletAdapter;
//# sourceMappingURL=index.js.map