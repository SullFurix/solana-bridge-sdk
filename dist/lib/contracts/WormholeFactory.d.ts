import { ContractFactory, Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import { UnsignedTransaction } from 'ethers/utils/transaction';
import { BigNumberish } from 'ethers/utils';
import { TransactionOverrides } from '.';
import { Wormhole } from './Wormhole';
export declare class WormholeFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(initial_guardian_set: {
        keys: string[];
        expiration_time: BigNumberish;
    }, wrapped_asset_master: string, _guardian_set_expirity: BigNumberish, overrides?: TransactionOverrides): Promise<Wormhole>;
    getDeployTransaction(initial_guardian_set: {
        keys: string[];
        expiration_time: BigNumberish;
    }, wrapped_asset_master: string, _guardian_set_expirity: BigNumberish, overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): Wormhole;
    connect(signer: Signer): WormholeFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): Wormhole;
}
//# sourceMappingURL=WormholeFactory.d.ts.map