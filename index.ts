import BraveCacheProvider from "./src/BraveCacheProvider";

const RegisteredProviders: Record<string, BraveCacheProvider> = {};
let DefaultProvider: BraveCacheProvider | undefined = undefined;

class BraveCache<Client = any> {
    // Instance provider holder
    provider: BraveCacheProvider<Client>;

    constructor(provider?: string) {
        this.provider = BraveCache.getProvider(provider);
    }

    /**
     * Get a value from the cache
     * @param key The key to get
     * @param def
     */
    get<Value = any>(key: string, def?: Value) {
        this.provider.hasFunctionOrThrowError("get");
        return this.provider.functions.get(key) as Value;
    }

    /**
     * Set a value in the cache
     * @param key The key to set
     * @param value The value to set
     */
    set<Value = any>(key: string, value: Value) {
        this.provider.hasFunctionOrThrowError("set");
        this.provider.functions.set(key, value);

        return this;
    }

    /**
     * Remove a value from the cache
     * @param key The key to remove
     */
    remove(key: string) {
        this.provider.hasFunctionOrThrowError("remove");
        this.provider.functions.remove(key);

        return this;
    }

    /**
     * Set default provider
     * @param name Provider to set as default
     */
    static setDefaultProvider(name: string) {
        DefaultProvider = RegisteredProviders[name];

        if (!DefaultProvider)
            throw new Error(`Provider ${name} not found. Please register it first.`);

        return this;
    }

    /**
     * Register provider
     * @param provider Provider to register
     * @param as
     */
    static registerProvider<T extends BraveCacheProvider>(provider: T, as?: string) {
        if (as) provider.name = as;

        // Add to the list of registered providers
        RegisteredProviders[provider.name] = provider;

        // Set default provider if not set
        if (!DefaultProvider) DefaultProvider = provider;

        return this;
    }

    /**
     * Get provider
     * @param name Provider to get
     */
    static getProvider<Client>(name?: string) {
        const provider: BraveCacheProvider<Client> | undefined = name
            ? RegisteredProviders[name]
            : DefaultProvider;

        if (!provider) throw new Error(`Provider ${name} not found. Please register it first.`);

        return provider;
    }
}

export { BraveCache };
