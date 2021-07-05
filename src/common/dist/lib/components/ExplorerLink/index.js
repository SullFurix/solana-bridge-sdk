"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExplorerLink = void 0;
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const utils_1 = require("../../utils/utils");
const contexts_1 = require("../../contexts");
const spl_token_registry_1 = require("@solana/spl-token-registry");
const explorer_1 = require("../../utils/explorer");
const ExplorerLink = (props) => {
    var _a, _b;
    const { type, code, short } = props;
    let { endpoint } = contexts_1.useConnectionConfig();
    const address = typeof props.address === 'string'
        ? props.address
        : (_a = props.address) === null || _a === void 0 ? void 0 : _a.toBase58();
    if (!address) {
        return null;
    }
    const displayAddress = short || props.length
        ? utils_1.shortenAddress(address, (_b = props.length) !== null && _b !== void 0 ? _b : 9)
        : address;
    const getClusterUrlParam = () => {
        var _a;
        // If ExplorerLink is used outside of ConnectionContext, ex. in notifications, then useConnectionConfig() won't return the current endpoint
        // It would instead return the default ENDPOINT  which is not that useful to us
        // If connection is provided then we can use it instead of the hook to resolve the endpoint
        if (props.connection) {
            // Endpoint is stored as internal _rpcEndpoint prop
            endpoint = (_a = props.connection._rpcEndpoint) !== null && _a !== void 0 ? _a : endpoint;
        }
        const env = contexts_1.ENDPOINTS.find(end => end.endpoint === endpoint);
        let cluster;
        if ((env === null || env === void 0 ? void 0 : env.ChainId) == spl_token_registry_1.ENV.Testnet) {
            cluster = 'testnet';
        }
        else if ((env === null || env === void 0 ? void 0 : env.ChainId) == spl_token_registry_1.ENV.Devnet) {
            if ((env === null || env === void 0 ? void 0 : env.name) === 'localnet') {
                cluster = `custom&customUrl=${encodeURIComponent('http://127.0.0.1:8899')}`;
            }
            else {
                cluster = 'devnet';
            }
        }
        return cluster ? `?cluster=${cluster}` : '';
    };
    return (react_1.default.createElement("a", { href: explorer_1.getExplorerUrl(address, endpoint, type, props.connection), 
        // eslint-disable-next-line react/jsx-no-target-blank
        target: "_blank", title: address, style: props.style }, code ? (react_1.default.createElement(antd_1.Typography.Text, { style: props.style, code: true }, displayAddress)) : (displayAddress)));
};
exports.ExplorerLink = ExplorerLink;
//# sourceMappingURL=index.js.map