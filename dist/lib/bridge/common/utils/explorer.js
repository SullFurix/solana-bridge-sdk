"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorerUrl = void 0;
const contexts_1 = require("../contexts");
const spl_token_registry_1 = require("@solana/spl-token-registry");
function getExplorerUrl(address, endpoint, type = 'address', connection) {
    const getClusterUrlParam = () => {
        var _a;
        // If ExplorerLink (or any other component)is used outside of ConnectionContext, ex. in notifications, then useConnectionConfig() won't return the current endpoint
        // It would instead return the default ENDPOINT  which is not that useful to us
        // If connection is provided then we can use it instead of the hook to resolve the endpoint
        if (connection) {
            // Endpoint is stored as internal _rpcEndpoint prop
            endpoint = (_a = connection._rpcEndpoint) !== null && _a !== void 0 ? _a : endpoint;
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
    return `https://explorer.solana.com/${type}/${address}${getClusterUrlParam()}`;
}
exports.getExplorerUrl = getExplorerUrl;
//# sourceMappingURL=explorer.js.map