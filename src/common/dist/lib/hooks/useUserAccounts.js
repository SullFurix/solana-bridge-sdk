"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserAccounts = void 0;
const accounts_1 = require("../contexts/accounts");
function useUserAccounts() {
    const context = accounts_1.useAccountsContext();
    return {
        userAccounts: context.userAccounts,
    };
}
exports.useUserAccounts = useUserAccounts;
//# sourceMappingURL=useUserAccounts.js.map