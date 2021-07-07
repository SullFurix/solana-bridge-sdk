/// <reference types="react" />
import { WalletAdapter } from '@solana/wallet-base';
import { SolongWalletAdapter } from '../wallet-adapters/solong';
import { PhantomWalletAdapter } from '../wallet-adapters/phantom';
import { LedgerWalletAdapter } from '@solana/wallet-ledger';
import { MathWalletAdapter } from "../wallet-adapters/mathWallet";
export declare const WALLET_PROVIDERS: ({
    name: string;
    url: string;
    icon: string;
    adapter: typeof PhantomWalletAdapter;
} | {
    name: string;
    url: string;
    icon: string;
    adapter: typeof LedgerWalletAdapter;
} | {
    name: string;
    url: string;
    icon: string;
    adapter?: undefined;
} | {
    name: string;
    url: string;
    icon: string;
    adapter: typeof SolongWalletAdapter;
} | {
    name: string;
    url: string;
    icon: string;
    adapter: typeof MathWalletAdapter;
})[];
export declare function WalletProvider({ children }: {
    children?: any;
}): JSX.Element;
export declare const useWallet: () => {
    wallet: WalletAdapter | undefined;
    connected: boolean;
    provider: {
        name: string;
        url: string;
        icon: string;
        adapter: typeof PhantomWalletAdapter;
    } | {
        name: string;
        url: string;
        icon: string;
        adapter: typeof LedgerWalletAdapter;
    } | {
        name: string;
        url: string;
        icon: string;
        adapter?: undefined;
    } | {
        name: string;
        url: string;
        icon: string;
        adapter: typeof SolongWalletAdapter;
    } | {
        name: string;
        url: string;
        icon: string;
        adapter: typeof MathWalletAdapter;
    } | undefined;
    select: () => void;
    connect(): void;
    disconnect(): void;
};
//# sourceMappingURL=wallet.d.ts.map