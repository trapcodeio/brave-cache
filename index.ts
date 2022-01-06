import BraveCacheProvider from "./src/BraveCacheProvider";
import { bc_getDefaultValue } from "./src/functions";

const RegisteredProviders: Record<string, BraveCacheProvider> = {};
let DefaultProvider: BraveCacheProvider | undefined = undefined;

class BraveCache<Client = any> {
    // Instance provider holder
    provider: BraveCacheProvider<Client>;

    constructor(provider?: string) {
        this.provider = BraveCache.getProvider(provider);
    }

    /**
     * Shorthand to initialize new cache instance
     * @param provider
     */
    static useProvider<Client>(provider: string): BraveCache<Client> {
        return new this(provider);
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
    static registerProvider(provider: BraveCacheProvider, as?: string) {
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

    /**
     * Get a value from the cache
     * @param key The key to get
     * @param def
     */
    get<Value = any>(key: string, def?: Value | (() => Value)) {
        this.provider.hasFunctionOrThrowError("get");

        let value: Value = this.provider.functions.get(key);

        if (value === undefined && def) return bc_getDefaultValue(def);

        return value;
    }

    /**
     * Async: Get a value from the cache
     * @param key The key to get
     * @param def
     */
    async getAsync<Value = any>(key: string, def?: Value | (() => Value)): Promise<Value> {
        this.provider.hasFunctionOrThrowError("get");

        let value: Value = await this.provider.functions.get(key);

        if (value === undefined && def) return bc_getDefaultValue(def);

        return value;
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
     * Async: Set a value in the cache
     * @param key The key to set
     * @param value The value to set
     */
    async setAsync<Value = any>(key: string, value: Value) {
        this.provider.hasFunctionOrThrowError("set");

        await this.provider.functions.set(key, value);

        return this;
    }

    /**
     * Remove data from the cache using key
     * @param key The key to remove
     */
    del(key: string) {
        this.provider.hasFunctionOrThrowError("del");
        this.provider.functions.del(key);

        return this;
    }

    /**
     * Async: Remove data from the cache using key
     * @param key The key to remove
     */
    async delAsync(key: string) {
        this.provider.hasFunctionOrThrowError("del");

        await this.provider.functions.del(key);

        return this;
    }

    /**
     * Remove data from the cache using key
     * @alias del
     */
    remove(key: string) {
        return this.del(key);
    }

    /**
     * Async: Remove data from the cache using key
     * @alias delAsync
     */
    removeAsync(key: string) {
        return this.delAsync(key);
    }

    /**
     * Check if a key exists in the cache
     * @param key
     */
    has(key: string) {
        this.provider.hasFunctionOrThrowError("has");
        return this.provider.functions.has(key);
    }

    /**
     * Async Check if a key exists in the cache
     * @param key
     */
    hasAsync(key: string) {
        return this.has(key) as Promise<boolean>;
    }

    /**
     * Get keys of items in the cache
     */
    keys() {
        this.provider.hasFunctionOrThrowError("keys");
        return this.provider.functions.keys() as string[];
    }

    /**
     * Async: Get keys of items in the cache
     */
    async keysAsync() {
        this.provider.hasFunctionOrThrowError("keys");
        return this.provider.functions.keys() as Promise<string[]>;
    }

    /**
     * Remove all items from the cache
     */
    flush() {
        this.provider.hasFunctionOrThrowError("flush");
        this.provider.functions.flush();
        return this;
    }

    /**
     * Async: Remove all items from the cache
     */
    async flushAsync() {
        this.provider.hasFunctionOrThrowError("flush");
        await this.provider.functions.flush();
        return this;
    }

    /**
     * Get the number of items in the cache
     */
    size() {
        return this.keys().length;
    }

    /**
     * Async: Get the number of items in the cache
     */
    async sizeAsync() {
        const keys = await this.keysAsync();
        return keys.length;
    }
}

export { BraveCache };
