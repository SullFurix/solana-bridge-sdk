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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWallet = exports.WalletProvider = exports.WALLET_PROVIDERS = void 0;
const sol_wallet_adapter_1 = __importDefault(require("@project-serum/sol-wallet-adapter"));
const antd_1 = require("antd");
const react_1 = __importStar(require("react"));
const notifications_1 = require("./../utils/notifications");
const connection_1 = require("./connection");
const utils_1 = require("../utils/utils");
const solong_1 = require("../wallet-adapters/solong");
const phantom_1 = require("../wallet-adapters/phantom");
const react_router_1 = require("react-router");
const wallet_ledger_1 = require("@solana/wallet-ledger");
const mathWallet_1 = require("../wallet-adapters/mathWallet");
const ASSETS_URL = 'https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/';
exports.WALLET_PROVIDERS = [
    {
        name: 'Phantom',
        url: 'https://www.phantom.app',
        icon: `https://www.phantom.app/img/logo.png`,
        adapter: phantom_1.PhantomWalletAdapter,
    },
    {
        name: 'Ledger',
        url: 'https://www.ledger.com',
        icon: `${ASSETS_URL}ledger.svg`,
        adapter: wallet_ledger_1.LedgerWalletAdapter,
    },
    {
        name: 'Sollet',
        url: 'https://www.sollet.io',
        icon: `${ASSETS_URL}sollet.svg`,
    },
    {
        name: 'Solong',
        url: 'https://solongwallet.com',
        icon: `${ASSETS_URL}solong.png`,
        adapter: solong_1.SolongWalletAdapter,
    },
    // TODO: enable when fully functional
    {
        name: 'MathWallet',
        url: 'https://mathwallet.org',
        icon: `${ASSETS_URL}mathwallet.svg`,
        adapter: mathWallet_1.MathWalletAdapter,
    },
    // {
    //   name: 'Torus',
    //   url: 'https://tor.us',
    //   icon: `${ASSETS_URL}torus.svg`,
    //   adapter: TorusWalletAdapter,
    // }
    // Solflare doesnt allow external connections for all apps
    // {
    //   name: "Solflare",
    //   url: "https://solflare.com/access-wallet",
    //   icon: `${ASSETS_URL}solflare.svg`,
    // },
];
const WalletContext = react_1.default.createContext({
    wallet: undefined,
    connected: false,
    select() { },
    provider: undefined,
});
function WalletProvider({ children = null }) {
    const { endpoint } = connection_1.useConnectionConfig();
    const location = react_router_1.useLocation();
    const [autoConnect, setAutoConnect] = react_1.useState(location.pathname.indexOf('result=') >= 0 || false);
    const [providerUrl, setProviderUrl] = utils_1.useLocalStorageState('walletProvider');
    const provider = react_1.useMemo(() => exports.WALLET_PROVIDERS.find(({ url }) => url === providerUrl), [providerUrl]);
    const wallet = react_1.useMemo(function () {
        if (provider) {
            try {
                return new (provider.adapter || sol_wallet_adapter_1.default)(providerUrl, endpoint);
            }
            catch (e) {
                console.log(`Error connecting to wallet ${provider.name}: ${e}`);
                return undefined;
            }
        }
    }, [provider, providerUrl, endpoint]);
    const [connected, setConnected] = react_1.useState(false);
    react_1.useEffect(() => {
        if (wallet) {
            wallet.on('connect', () => {
                if (wallet.publicKey) {
                    setConnected(true);
                    const walletPublicKey = wallet.publicKey.toBase58();
                    const keyToDisplay = walletPublicKey.length > 20
                        ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(walletPublicKey.length - 7, walletPublicKey.length)}`
                        : walletPublicKey;
                    notifications_1.notify({
                        message: 'Wallet update',
                        description: 'Connected to wallet ' + keyToDisplay,
                    });
                }
            });
            wallet.on('disconnect', () => {
                setConnected(false);
                // setProviderUrl(null)
                notifications_1.notify({
                    message: 'Wallet update',
                    description: 'Disconnected from wallet',
                });
            });
        }
        return () => {
            setConnected(false);
            // setProviderUrl(null)
            if (wallet) {
                wallet.disconnect();
            }
        };
    }, [wallet]);
    react_1.useEffect(() => {
        if (wallet && autoConnect) {
            wallet.connect();
            setAutoConnect(false);
        }
        return () => { };
    }, [wallet, autoConnect]);
    const [isModalVisible, setIsModalVisible] = react_1.useState(false);
    const select = react_1.useCallback(() => setIsModalVisible(true), []);
    const close = react_1.useCallback(() => setIsModalVisible(false), []);
    return (react_1.default.createElement(WalletContext.Provider, { value: {
            wallet,
            connected,
            select,
            provider,
        } }, children, react_1.default.createElement(antd_1.Modal, { title: "Select Wallet", okText: "Connect", visible: isModalVisible, okButtonProps: { style: { display: 'none' } }, onCancel: close, width: 400 }, exports.WALLET_PROVIDERS.map((provider, idx) => {
        const onClick = function () {
            setProviderUrl(provider.url);
            setAutoConnect(true);
            close();
        };
        return (react_1.default.createElement(antd_1.Button, { key: idx, size: "large", type: providerUrl === provider.url ? 'primary' : 'ghost', onClick: onClick, icon: react_1.default.createElement("img", { alt: `${provider.name}`, width: 20, height: 20, src: provider.icon, style: { marginRight: 8 } }), style: {
                display: 'block',
                width: '100%',
                textAlign: 'left',
                marginBottom: 8,
            } }, provider.name));
    }))));
}
exports.WalletProvider = WalletProvider;
const useWallet = () => {
    const { wallet, connected, provider, select } = react_1.useContext(WalletContext);
    return {
        wallet,
        connected,
        provider,
        select,
        connect() {
            wallet ? wallet.connect() : select();
        },
        disconnect() {
            wallet === null || wallet === void 0 ? void 0 : wallet.disconnect();
        },
    };
};
exports.useWallet = useWallet;
//# sourceMappingURL=wallet.js.map