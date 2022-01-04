export type BraveCacheProviderConfig = {
    expires?: true;
};

export type BraveCacheProviderFunctions = {
    get(key: string): any;
    set(key: string, value: any): any;
    remove(key: string): void;
    has(key: string): boolean;
    flush(): void;
};

class BraveCacheProvider<Client = any> {
    name: string;
    client?: Client;
    functions: BraveCacheProviderFunctions;
    config: BraveCacheProviderConfig = {
        expires: true
    };

    /**
     * Initialize the cache provider
     * @param options
     */
    constructor(options: {
        name: string;
        functions: BraveCacheProviderFunctions;
        client?: Client;
        config?: BraveCacheProviderConfig;
    }) {
        this.name = options.name;
        this.client = options.client;
        this.functions = options.functions;

        // Merge config
        this.config = {
            ...this.config,
            ...(options.config || {})
        };
    }

    /**
     * Check if the cache provider has a client
     */
    hasClient() {
        return !!this.client;
    }

    /**
     * Check if the cache provider has a function
     * @param name
     */
    hasFunctionOrThrowError(name: string) {
        // Throw error when get function is not defined
        if (!this.functions.hasOwnProperty(name))
            throw new Error(`Cache Provider: ${name} has no get function!`);
    }
}

export default BraveCacheProvider;
