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
    client: Client;
    functions: BraveCacheProviderFunctions;
    config: BraveCacheProviderConfig = {
        expires: true
    };

    /**
     * Initialize the cache provider
     * @param name - The name of the cache provider
     * @param client - The client to use for the cache provider
     * @param functions - The functions to use for the cache provider
     * @param config - The config to use for the cache provider
     */
    constructor(
        name: string,
        client: Client,
        functions: BraveCacheProviderFunctions,
        config: BraveCacheProviderConfig = {}
    ) {
        this.name = name;
        this.client = client;
        this.functions = functions;

        // Merge config
        this.config = {
            ...this.config,
            ...config
        };
    }

    hasFunctionOrThrowError(name: string) {
        // Throw error when get function is not defined
        if (!this.functions.hasOwnProperty(name))
            throw new Error(`Cache Provider: ${name} has no get function!`);
    }
}

export default BraveCacheProvider;
