"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayBalance = void 0;
const bignumber_js_1 = require("bignumber.js");
const displayBalance = (info) => {
    try {
        const balance = (info === null || info === void 0 ? void 0 : info.balance) || new bignumber_js_1.BigNumber(0);
        const precision = new bignumber_js_1.BigNumber(10).pow((info === null || info === void 0 ? void 0 : info.decimals) || new bignumber_js_1.BigNumber(0));
        return balance.div(precision).toNumber();
    }
    catch (e) {
        return 0;
    }
};
exports.displayBalance = displayBalance;
//# sourceMappingURL=interface.js.map