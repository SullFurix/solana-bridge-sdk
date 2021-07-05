"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolongAdapter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const web3_js_1 = require("@solana/web3.js");
const notifications_1 = require("../utils/notifications");
class SolongAdapter extends eventemitter3_1.default {
    constructor(providerUrl, network) {
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
exports.SolongAdapter = SolongAdapter;
//# sourceMappingURL=solong_adapter.js.map