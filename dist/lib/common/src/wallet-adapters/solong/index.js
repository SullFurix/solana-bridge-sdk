"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolongWalletAdapter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const web3_js_1 = require("@solana/web3.js");
const notifications_1 = require("../../utils/notifications");
class SolongWalletAdapter extends eventemitter3_1.default {
    constructor() {
        super();
        this._publicKey = null;
        this._onProcess = false;
        this.connect = this.connect.bind(this);
    }
    get publicKey() {
        return this._publicKey;
    }
    async signTransaction(transaction) {
        return window.solong.signTransaction(transaction);
    }
    async signAllTransactions(transactions) {
        const solong = window.solong;
        // Temp. workaround to ensure requests to sign multiple transactions at once don't fail when Solong wallet is used
        // Signing transactions one by one as a fallback works but the UX is not great because user is asked to sign multiple times
        for (let t of transactions) {
            await solong.signTransaction(t);
        }
        return transactions;
    }
    connect() {
        if (this._onProcess) {
            return;
        }
        if (window.solong === undefined) {
            notifications_1.notify({
                message: 'Solong Error',
                description: 'Please install solong wallet from Chrome ',
            });
            return;
        }
        this._onProcess = true;
        window.solong
            .selectAccount()
            .then((account) => {
            this._publicKey = new web3_js_1.PublicKey(account);
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
            this.emit('disconnect');
        }
    }
}
exports.SolongWalletAdapter = SolongWalletAdapter;
//# sourceMappingURL=index.js.map