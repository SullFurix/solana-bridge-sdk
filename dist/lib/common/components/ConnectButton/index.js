"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectButton = void 0;
const antd_1 = require("antd");
const react_1 = __importDefault(require("react"));
const wallet_1 = require("./../../contexts/wallet");
const ConnectButton = (props) => {
    const { connected, connect, select, provider } = wallet_1.useWallet();
    const { onClick, children, disabled, allowWalletChange, ...rest } = props;
    // only show if wallet selected or user connected
    const menu = (react_1.default.createElement(antd_1.Menu, null,
        react_1.default.createElement(antd_1.Menu.Item, { key: "3", onClick: select }, "Change Wallet")));
    if (!provider || !allowWalletChange) {
        return (react_1.default.createElement(antd_1.Button, { ...rest, onClick: connected ? onClick : connect, disabled: connected && disabled }, connected ? props.children : 'Connect'));
    }
    return (react_1.default.createElement(antd_1.Dropdown.Button, { onClick: connected ? onClick : connect, disabled: connected && disabled, overlay: menu }, "Connect"));
};
exports.ConnectButton = ConnectButton;
//# sourceMappingURL=index.js.map