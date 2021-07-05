import { ContractFactory, Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import { UnsignedTransaction } from 'ethers/utils/transaction';
import { TransactionOverrides } from '.';
import { ERC20 } from './ERC20';
export declare class ERC20Factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(name_: string, symbol_: string, overrides?: TransactionOverrides): Promise<ERC20>;
    getDeployTransaction(name_: string, symbol_: string, overrides?: TransactionOverrides): UnsignedTransaction;
    attach(address: string): ERC20;
    connect(signer: Signer): ERC20Factory;
    static connect(address: string, signerOrProvider: Signer | Provider): ERC20;
}
//# sourceMappingURL=ERC20Factory.d.ts.map