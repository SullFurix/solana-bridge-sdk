import { ContractFactory, Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import { UnsignedTransaction } from 'ethers/utils/transaction';
import { TransactionOverrides } from '.';
import { WrappedAsset } from './WrappedAsset';
export declare class WrappedAssetFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: TransactionOverrides): Promise<WrappedAsset>;
    getDeployTransaction(overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): WrappedAsset;
    connect(signer: Signer): WrappedAssetFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): WrappedAsset;
}
//# sourceMappingURL=WrappedAssetFactory.d.ts.map