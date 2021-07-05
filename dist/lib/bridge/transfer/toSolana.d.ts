import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';
import { TransferRequest, ProgressUpdate } from './interface';
import { WalletAdapter } from '@solana/wallet-base';
export declare const toSolana: (connection: Connection, wallet: WalletAdapter, request: TransferRequest, provider: ethers.providers.Web3Provider, setProgress: (update: ProgressUpdate) => void) => Promise<void>;
//# sourceMappingURL=toSolana.d.ts.map