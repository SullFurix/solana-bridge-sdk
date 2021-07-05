"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TorusWalletAdapter = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const web3_js_1 = require("@solana/web3.js");
const openlogin_1 = __importDefault(require("@toruslabs/openlogin"));
const openlogin_ed25519_1 = require("@toruslabs/openlogin-ed25519");
const getSolanaPrivateKey = (openloginKey) => {
    const { sk } = openlogin_ed25519_1.getED25519Key(openloginKey);
    return sk;
};
class TorusWalletAdapter extends eventemitter3_1.default {
    constructor(providerUrl, endpoint) {
        super();
        this.image = '';
        this.name = '';
        this.connect = async () => {
            var _a, _b, _c;
            const clientId = process.env.REACT_APP_CLIENT_ID ||
                'BNxdRWx08cSTPlzMAaShlM62d4f8Tp6racfnCg_gaH0XQ1NfSGo3h5B_IkLtgSnPMhlxsSvhqugWm0x8x-VkUXA';
            this._provider = new openlogin_1.default({
                clientId,
                network: 'testnet',
                uxMode: 'popup',
            });
            try {
                await this._provider.init();
            }
            catch (ex) {
                console.error('init failed', ex);
            }
            console.error((_a = this._provider) === null || _a === void 0 ? void 0 : _a.state.store);
            if (this._provider.privKey) {
                const privateKey = this._provider.privKey;
                const secretKey = getSolanaPrivateKey(privateKey);
                this.account = new web3_js_1.Account(secretKey);
            }
            else {
                try {
                    const { privKey } = await this._provider.login({
                        loginProvider: 'unselected',
                    });
                    const secretKey = getSolanaPrivateKey(privKey);
                    this.account = new web3_js_1.Account(secretKey);
                }
                catch (ex) {
                    console.error('login failed', ex);
                }
            }
            this.name = (_b = this._provider) === null || _b === void 0 ? void 0 : _b.state.store.get('name');
            this.image = (_c = this._provider) === null || _c === void 0 ? void 0 : _c.state.store.get('profileImage');
            debugger;
            this.emit('connect');
        };
        this.disconnect = async () => {
            console.log('Disconnecting...');
            if (this._provider) {
                await this._provider.logout();
                await this._provider._cleanup();
                this._provider = undefined;
                this.emit('disconnect');
            }
        };
        this.connect = this.connect.bind(this);
        this.endpoint = endpoint;
        this.providerUrl = providerUrl;
    }
    async signAllTransactions(transactions) {
        if (this.account) {
            let account = this.account;
            transactions.forEach(t => t.partialSign(account));
        }
        return transactions;
    }
    get publicKey() {
        var _a;
        return ((_a = this.account) === null || _a === void 0 ? void 0 : _a.publicKey) || null;
    }
    async signTransaction(transaction) {
        if (this.account) {
            transaction.partialSign(this.account);
        }
        return transaction;
    }
}
exports.TorusWalletAdapter = TorusWalletAdapter;
//# sourceMappingURL=index.js.map