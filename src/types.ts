export type BraveCacheProviderConfig = {
    expires?: true;
};

export type BraveCacheProviderFunctions = {
    get: (key: string) => any | Promise<any>;
    set: (key: string, value: any, ttl?: number) => any | Promise<any>;
    del: (key: string) => any | Promise<any>;
    has: (key: string) => boolean | Promise<boolean>;
    flush: () => any | Promise<any>;
    keys: () => string[] | Promise<string[]>;

    // Optional
    getMany?: (keys: string[]) => Record<string, any> | Promise<Record<string, any>>;
};
