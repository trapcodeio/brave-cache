import { BraveCacheProviderConfig, BraveCacheProviderFunctions } from "./types";

type RequiredFunctions = keyof BraveCacheProviderFunctions;
const RequiredFunctions: Array<RequiredFunctions> = ["get", "set", "del", "has", "flush", "keys"];

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
        if (!options.name) {
            throw new Error("Cache provider name is required!");
        } else if (!options.functions) {
            throw new Error("Cache provider functions are required!");
        }

        this.name = options.name;
        this.client = options.client;
        this.functions = options.functions;

        // Merge config
        this.config = {
            ...this.config,
            ...(options.config || {})
        };

        // Check if all functions exists
        const missing: string[] = [];

        for (const key of RequiredFunctions) {
            if (!this.functions.hasOwnProperty(key)) {
                missing.push(key);
            }
        }

        if (missing.length) {
            throw new Error(`Cache provider functions are missing: [${missing.join(", ")}]`);
        }
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

export = BraveCacheProvider;
