export var __esModule: boolean;
export var WALLET_PROVIDERS: ({
    name: string;
    url: string;
    icon: string;
    adapter: typeof phantom_1.PhantomWalletAdapter;
} | {
    name: string;
    url: string;
    icon: string;
    adapter: typeof wallet_ledger_1.LedgerWalletAdapter;
} | {
    name: string;
    url: string;
    icon: string;
    adapter?: undefined;
} | {
    name: string;
    url: string;
    icon: string;
    adapter: typeof solong_1.SolongWalletAdapter;
} | {
    name: string;
    url: string;
    icon: string;
    adapter: typeof mathWallet_1.MathWalletAdapter;
})[];
import phantom_1 = require("../wallet-adapters/phantom");
import wallet_ledger_1 = require("@solana/wallet-ledger");
import solong_1 = require("../wallet-adapters/solong");
import mathWallet_1 = require("../wallet-adapters/mathWallet");
export function WalletProvider({ children }: {
    children?: any;
}): any;
export function useWallet(): {
    wallet: any;
    connected: any;
    provider: any;
    select: any;
    connect(): void;
    disconnect(): void;
};
//# sourceMappingURL=wallet.d.ts.map