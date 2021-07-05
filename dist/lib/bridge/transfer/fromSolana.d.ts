import { WalletAdapter } from '@solana/wallet-base';
import { ethers } from 'ethers';
import { Connection } from '@solana/web3.js';
import { ProgressUpdate, TransferRequest } from './interface';
import { SolanaBridge } from '../../core';
export declare const fromSolana: (connection: Connection, wallet: WalletAdapter, request: TransferRequest, provider: ethers.providers.Web3Provider, setProgress: (update: ProgressUpdate) => void, bridge?: SolanaBridge | undefined) => Promise<void>;
//# sourceMappingURL=fromSolana.d.ts.map