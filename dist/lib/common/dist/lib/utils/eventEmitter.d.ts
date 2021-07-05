export var __esModule: boolean;
export class CacheUpdateEvent {
    constructor(id: any, isNew: any, parser: any);
    id: any;
    parser: any;
    isNew: any;
}
export namespace CacheUpdateEvent {
    const type: string;
}
export class CacheDeleteEvent {
    constructor(id: any);
    id: any;
}
export namespace CacheDeleteEvent {
    const type_1: string;
    export { type_1 as type };
}
export class MarketUpdateEvent {
    constructor(ids: any);
    ids: any;
}
export namespace MarketUpdateEvent {
    const type_2: string;
    export { type_2 as type };
}
export class EventEmitter {
    emitter: eventemitter3_1<string | symbol, any>;
    onMarket(callback: any): () => eventemitter3_1<string | symbol, any>;
    onCache(callback: any): () => eventemitter3_1<string | symbol, any>;
    raiseMarketUpdated(ids: any): void;
    raiseCacheUpdated(id: any, isNew: any, parser: any): void;
    raiseCacheDeleted(id: any): void;
}
import eventemitter3_1 = require("eventemitter3");
//# sourceMappingURL=eventEmitter.d.ts.map