"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.convert = exports.formatPct = exports.formatNumber = exports.formatUSD = exports.formatTokenAmount = exports.formatAmount = exports.tryParseKey = exports.fromLamports = exports.wadToLamports = exports.toLamports = exports.chunks = exports.STABLE_COINS = exports.isKnownMint = exports.getTokenIcon = exports.getTokenByName = exports.getVerboseTokenName = exports.getTokenName = exports.shortenAddress = exports.useLocalStorageState = exports.formatPriceNumber = void 0;
const react_1 = require("react");
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const constants_1 = require("../constants");
exports.formatPriceNumber = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
});
function useLocalStorageState(key, defaultState) {
    const [state, setState] = react_1.useState(() => {
        // NOTE: Not sure if this is ok
        const storedState = localStorage.getItem(key);
        if (storedState) {
            return JSON.parse(storedState);
        }
        return defaultState;
    });
    const setLocalStorageState = react_1.useCallback(newState => {
        const changed = state !== newState;
        if (!changed) {
            return;
        }
        setState(newState);
        if (newState === null) {
            localStorage.removeItem(key);
        }
        else {
            localStorage.setItem(key, JSON.stringify(newState));
        }
    }, [state, key]);
    return [state, setLocalStorageState];
}
exports.useLocalStorageState = useLocalStorageState;
// shorten the checksummed version of the input address to have 4 characters at start and end
function shortenAddress(address, chars = 4) {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
exports.shortenAddress = shortenAddress;
function getTokenName(map, mint, shorten = true) {
    var _a;
    const mintAddress = typeof mint === 'string' ? mint : mint === null || mint === void 0 ? void 0 : mint.toBase58();
    if (!mintAddress) {
        return 'N/A';
    }
    const knownSymbol = (_a = map.get(mintAddress)) === null || _a === void 0 ? void 0 : _a.symbol;
    if (knownSymbol) {
        return knownSymbol;
    }
    return shorten ? `${mintAddress.substring(0, 5)}...` : mintAddress;
}
exports.getTokenName = getTokenName;
function getVerboseTokenName(map, mint, shorten = true) {
    var _a;
    const mintAddress = typeof mint === 'string' ? mint : mint === null || mint === void 0 ? void 0 : mint.toBase58();
    if (!mintAddress) {
        return 'N/A';
    }
    const knownName = (_a = map.get(mintAddress)) === null || _a === void 0 ? void 0 : _a.name;
    if (knownName) {
        return knownName;
    }
    return shorten ? `${mintAddress.substring(0, 5)}...` : mintAddress;
}
exports.getVerboseTokenName = getVerboseTokenName;
function getTokenByName(tokenMap, name) {
    let token = null;
    for (const val of tokenMap.values()) {
        if (val.symbol === name) {
            token = val;
            break;
        }
    }
    return token;
}
exports.getTokenByName = getTokenByName;
function getTokenIcon(map, mintAddress) {
    var _a;
    const address = typeof mintAddress === 'string' ? mintAddress : mintAddress === null || mintAddress === void 0 ? void 0 : mintAddress.toBase58();
    if (!address) {
        return;
    }
    return (_a = map.get(address)) === null || _a === void 0 ? void 0 : _a.logoURI;
}
exports.getTokenIcon = getTokenIcon;
function isKnownMint(map, mintAddress) {
    return !!map.get(mintAddress);
}
exports.isKnownMint = isKnownMint;
exports.STABLE_COINS = new Set(['USDC', 'wUSDC', 'USDT']);
function chunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
}
exports.chunks = chunks;
function toLamports(account, mint) {
    var _a;
    if (!account) {
        return 0;
    }
    const amount = typeof account === 'number' ? account : (_a = account.info.amount) === null || _a === void 0 ? void 0 : _a.toNumber();
    const precision = Math.pow(10, (mint === null || mint === void 0 ? void 0 : mint.decimals) || 0);
    return Math.floor(amount * precision);
}
exports.toLamports = toLamports;
function wadToLamports(amount) {
    return (amount === null || amount === void 0 ? void 0 : amount.div(constants_1.WAD)) || constants_1.ZERO;
}
exports.wadToLamports = wadToLamports;
function fromLamports(account, mint, rate = 1.0) {
    if (!account) {
        return 0;
    }
    const amount = Math.floor(typeof account === 'number'
        ? account
        : bn_js_1.default.isBN(account)
            ? account.toNumber()
            : account.info.amount.toNumber());
    const precision = Math.pow(10, (mint === null || mint === void 0 ? void 0 : mint.decimals) || 0);
    return (amount / precision) * rate;
}
exports.fromLamports = fromLamports;
const tryParseKey = (key) => {
    try {
        return new web3_js_1.PublicKey(key);
    }
    catch (error) {
        return null;
    }
};
exports.tryParseKey = tryParseKey;
var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
const abbreviateNumber = (number, precision) => {
    let tier = (Math.log10(number) / 3) | 0;
    let scaled = number;
    let suffix = SI_SYMBOL[tier];
    if (tier !== 0) {
        let scale = Math.pow(10, tier * 3);
        scaled = number / scale;
    }
    return scaled.toFixed(precision) + suffix;
};
const formatAmount = (val, precision = 6, abbr = true) => (abbr ? abbreviateNumber(val, precision) : val.toFixed(precision));
exports.formatAmount = formatAmount;
function formatTokenAmount(account, mint, rate = 1.0, prefix = '', suffix = '', precision = 6, abbr = false) {
    if (!account) {
        return '';
    }
    return `${[prefix]}${exports.formatAmount(fromLamports(account, mint, rate), precision, abbr)}${suffix}`;
}
exports.formatTokenAmount = formatTokenAmount;
exports.formatUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
const numberFormater = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
exports.formatNumber = {
    format: (val) => {
        if (!val) {
            return '--';
        }
        return numberFormater.format(val);
    },
};
exports.formatPct = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
function convert(account, mint, rate = 1.0) {
    var _a;
    if (!account) {
        return 0;
    }
    const amount = typeof account === 'number' ? account : (_a = account.info.amount) === null || _a === void 0 ? void 0 : _a.toNumber();
    const precision = Math.pow(10, (mint === null || mint === void 0 ? void 0 : mint.decimals) || 0);
    let result = (amount / precision) * rate;
    return result;
}
exports.convert = convert;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
exports.sleep = sleep;
//# sourceMappingURL=utils.js.map