"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTokenName = void 0;
const connection_1 = require("../contexts/connection");
const utils_1 = require("../utils/utils");
function useTokenName(mintAddress) {
    const { tokenMap } = connection_1.useConnectionConfig();
    const address = typeof mintAddress === 'string' ? mintAddress : mintAddress === null || mintAddress === void 0 ? void 0 : mintAddress.toBase58();
    return utils_1.getTokenName(tokenMap, address);
}
exports.useTokenName = useTokenName;
//# sourceMappingURL=useTokenName.js.map