import EventEmitter from 'eventemitter3';
export declare class SolongAdapter extends EventEmitter {
    _publicKey: any;
    _onProcess: boolean;
    constructor(providerUrl: string, network: string);
    get publicKey(): any;
    signTransaction(transaction: any): Promise<any>;
    connect(): void;
    disconnect(): void;
}
//# sourceMappingURL=solong_adapter.d.ts.map