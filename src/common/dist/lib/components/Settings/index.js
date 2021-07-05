"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
const react_1 = __importDefault(require("react"));
const antd_1 = require("antd");
const wallet_1 = require("../../contexts/wallet");
const connection_1 = require("../../contexts/connection");
const utils_1 = require("../../utils");
const icons_1 = require("@ant-design/icons");
const Settings = ({ additionalSettings, }) => {
    const { connected, disconnect, select, wallet } = wallet_1.useWallet();
    const { endpoint, setEndpoint } = connection_1.useConnectionConfig();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { style: { display: 'grid' } },
            "Network:",
            ' ',
            react_1.default.createElement(antd_1.Select, { onSelect: setEndpoint, value: endpoint, style: { marginBottom: 20 } }, connection_1.ENDPOINTS.map(({ name, endpoint }) => (react_1.default.createElement(antd_1.Select.Option, { value: endpoint, key: endpoint }, name)))),
            connected && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("span", null, "Wallet:"),
                (wallet === null || wallet === void 0 ? void 0 : wallet.publicKey) && (react_1.default.createElement(antd_1.Button, { style: { marginBottom: 5 }, onClick: () => {
                        var _a;
                        return navigator.clipboard.writeText(((_a = wallet.publicKey) === null || _a === void 0 ? void 0 : _a.toBase58()) || '');
                    } },
                    react_1.default.createElement(icons_1.CopyOutlined, null),
                    utils_1.shortenAddress(wallet === null || wallet === void 0 ? void 0 : wallet.publicKey.toBase58()))),
                react_1.default.createElement(antd_1.Button, { onClick: select, style: { marginBottom: 5 } }, "Change"),
                react_1.default.createElement(antd_1.Button, { type: "primary", onClick: disconnect, style: { marginBottom: 5 } }, "Disconnect"))),
            additionalSettings)));
};
exports.Settings = Settings;
//# sourceMappingURL=index.js.map