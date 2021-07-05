"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveERC20Address = exports.WRAPPED_MASTER = void 0;
const utils_1 = require("ethers/utils");
const ids_1 = require("./../common/dist/lib/utils/ids");
exports.WRAPPED_MASTER = '9A5e27995309a03f8B583feBdE7eF289FcCdC6Ae';
// derive the ERC20 address of a Solana SPL asset wrapped on ETH.
function deriveERC20Address(key) {
    const { wormhole } = ids_1.programIds();
    let hashData = '0xff' + wormhole.bridge.slice(2);
    hashData += utils_1.keccak256(Buffer.concat([new Buffer([1]), key.toBuffer()])).slice(2); // asset_id
    hashData += utils_1.keccak256('0x3d602d80600a3d3981f3363d3d373d3d3d363d73' +
        exports.WRAPPED_MASTER +
        '5af43d82803e903d91602b57fd5bf3').slice(2); // Bytecode
    return utils_1.keccak256(hashData).slice(26);
}
exports.deriveERC20Address = deriveERC20Address;
//# sourceMappingURL=utils.js.map