import BraveCacheProvider from "./src/provider";
import { bc_getDefaultValue, bc_removePrefixFromObjectKeys } from "./src/functions";
import ObjectCacheProvider from "./providers/object-cache";

const RegisteredProviders: Record<string, BraveCacheProvider> = {};
let DefaultProvider: BraveCacheProvider | undefined = undefined;

type BraveCacheOptions = { provider?: string; prefix?: string | boolean; prefixSeparator?: string };

class BraveCache<Client = any> {
    // Instance provider holder
    provider: BraveCacheProvider<Client>;
    options: BraveCacheOptions;

    constructor(provider?: string, options?: BraveCacheOptions);
    constructor(options?: BraveCacheOptions);
    constructor(provider?: string | BraveCacheOptions, options?: BraveCacheOptions) {
        if (typeof provider === "object") {
            options = provider;
            provider = options.provider;
        } else if (options) {
            // set options provider name value
            options.provider = provider;
        }

        this.provider = BraveCache.getProvider(provider);

        // Merge options
        this.options = {
            prefix: false,
            prefixSeparator: ":",
            ...(options ? options : {})
        };
    }

    /**
     * Shorthand to initialize new cache instance
     * @param provider
     * @param options
     */
    static useProvider<Client>(provider: string, options?: BraveCacheOptions): BraveCache<Client> {
        return new this(provider, options);
    }

    /**
     * Set default provider
     * @param name Provider to set as default
     */
    static setDefaultProvider(name: string) {
        DefaultProvider = RegisteredProviders[name];

        if (!DefaultProvider) throw new Error(`Provider ${name} not found. Register it first.`);

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
     * Get list of registered providers
     */
    static registeredProviders() {
        return Object.keys(RegisteredProviders);
    }

    /**
     * Get key prefix if prefix is enabled
     * @param key
     * @private
     */
    private prefix(key: string) {
        return this.hasPrefix ? this.options.prefix! + this.options.prefixSeparator! + key : key;
    }

    private get hasPrefix() {
        return typeof this.options.prefix === "string" && this.options.prefix.trim().length > 0;
    }

    private get prefixWithSeparator() {
        return this.hasPrefix ? this.options.prefix! + this.options.prefixSeparator! : "";
    }

    /**
     * Get a value from the cache
     * @param key The key to get
     * @param def
     */
    get<Value = any>(key: string, def?: Value | (() => Value)) {
        this.provider.hasFunctionOrThrowError("get");

        let value: Value = this.provider.functions.get(this.prefix(key));

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

        let value: Value = await this.provider.functions.get(this.prefix(key));

        if (value === undefined && def) return bc_getDefaultValue(def);

        return value;
    }

    /**
     * Get multiple values from the cache
     * @param keys
     */
    getMany<Values extends Record<string, any>>(keys: string[]) {
        let items = {} as Record<string, any>;

        if (this.provider.functions.getMany) {
            // Prefix keys
            if (this.hasPrefix) keys = keys.map((key) => this.prefix(key));

            items = this.provider.functions.getMany(keys) as Values;
        } else {
            for (const key of keys) {
                items[this.prefix(key)] = this.get(key);
            }
        }

        if (this.hasPrefix) {
            // Remove prefix
            items = bc_removePrefixFromObjectKeys(
                items,
                this.options.prefix as string,
                this.options.prefixSeparator!
            );
        }

        return items;
    }

    /**
     * Async: Get multiple values from the cache
     * @param keys
     */
    async getManyAsync<Values extends Record<string, any>>(keys: string[]) {
        let items = {} as Record<string, any>;

        if (this.provider.functions.getMany) {
            // Prefix keys
            if (this.hasPrefix) keys = keys.map((key) => this.prefix(key));
            items = (await this.provider.functions.getMany(keys)) as Values;
        } else {
            for (const key of keys) {
                items[this.prefix(key)] = await this.getAsync(key);
            }
        }

        if (this.hasPrefix) {
            // Remove prefix
            items = bc_removePrefixFromObjectKeys(
                items,
                this.options.prefix as string,
                this.options.prefixSeparator!
            );
        }

        return items;
    }

    /**
     * Find or create a value in the cache
     * @param key The key to set
     * @param set The value to set
     * @param ttl The time to live in seconds
     */
    getOrSet<Value = any>(key: string, set: Value | (() => Value), ttl?: number) {
        if (this.has(key)) return this.get<Value>(key);

        const value = bc_getDefaultValue(set);
        this.set(key, value, ttl);

        return value;
    }

    /**
     * Async: Find or create a value in the cache
     * @param key The key to set
     * @param set The value to set
     * @param ttl Time to live in seconds
     */
    async getOrSetAsync<Value = any>(
        key: string,
        set: Value | (() => Value),
        ttl?: number
    ): Promise<Value> {
        if (await this.hasAsync(key)) return this.getAsync<Value>(key);

        const value = await bc_getDefaultValue(set);
        await this.setAsync(key, value, ttl);

        return value;
    }

    /**
     * Set a value in the cache
     * @param key The key to set
     * @param value The value to set
     * @param ttl Time to live in seconds
     */
    set<Value = any>(key: string, value: Value, ttl?: number) {
        this.provider.hasFunctionOrThrowError("set");
        this.provider.functions.set(this.prefix(key), value, ttl);

        return this;
    }

    /**
     * Async: Set a value in the cache
     * @param key The key to set
     * @param value The value to set
     * @param ttl Time to live in seconds
     */
    async setAsync<Value = any>(key: string, value: Value, ttl?: number) {
        this.provider.hasFunctionOrThrowError("set");
        await this.provider.functions.set(this.prefix(key), value, ttl);

        return this;
    }

    /**
     * Set multiple values in the cache
     * @param values
     */
    setMany(
        values:
            | Array<[key: string, value: any, ttl?: number]>
            | Array<{ key: string; value: any; ttl?: number }>
    ) {
        for (const value of values) {
            if (Array.isArray(value)) {
                this.set(value[0], value[1], value[2]);
            } else {
                this.set(value.key, value.value, value.ttl);
            }
        }

        return this;
    }

    /**
     * Async: Set multiple values in the cache
     * @param values
     */
    async setManyAsync(
        values:
            | Array<[key: string, value: any, ttl?: number]>
            | Array<{ key: string; value: any; ttl?: number }>
    ) {
        for (const value of values) {
            if (Array.isArray(value)) {
                await this.setAsync(value[0], value[1], value[2]);
            } else {
                await this.setAsync(value.key, value.value, value.ttl);
            }
        }

        return this;
    }

    /**
     * Remove data from the cache using key
     * @param key The key to remove
     */
    del(key: string) {
        this.provider.hasFunctionOrThrowError("del");
        this.provider.functions.del(this.prefix(key));

        return this;
    }

    /**
     * Async: Remove data from the cache using key
     * @param key The key to remove
     */
    async delAsync(key: string) {
        this.provider.hasFunctionOrThrowError("del");
        await this.provider.functions.del(this.prefix(key));

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
        return this.provider.functions.has(this.prefix(key)) as boolean;
    }

    /**
     * Async Check if a key exists in the cache
     * @param key
     */
    async hasAsync(key: string) {
        return this.has(key);
    }

    /**
     * Get keys of items in the cache
     */
    keys(withPrefix = false) {
        this.provider.hasFunctionOrThrowError("keys");
        let keys = this.provider.functions.keys() as string[];

        if (this.hasPrefix && !withPrefix) {
            // Remove keys that don't have the prefix
            keys = keys.filter((key) => key.startsWith(this.prefixWithSeparator));

            // Remove the prefix
            return keys.map((key) => key.replace(this.prefixWithSeparator, ""));
        }

        return keys;
    }

    /**
     * Async: Get keys of items in the cache
     */
    async keysAsync(withPrefix = false) {
        this.provider.hasFunctionOrThrowError("keys");
        let keys = await this.provider.functions.keys();

        if (this.hasPrefix && !withPrefix) {
            // Remove keys that don't have the prefix
            keys = keys.filter((key) => key.startsWith(this.prefixWithSeparator));

            // Remove the prefix
            return keys.map((key) => key.replace(this.prefixWithSeparator, ""));
        }

        return keys;
    }

    /**
     * Get keys with prefix
     */
    keysWithPrefix() {
        return this.keys(true);
    }

    /**
     * Async: Get keys with prefix
     */
    async keysWithPrefixAsync() {
        return this.keysAsync(true);
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

// Set Default Provider to ObjectCacheProvider
BraveCache.registerProvider(ObjectCacheProvider());

export = BraveCache;
