import BraveCacheProvider from "../src/BraveCacheProvider";
import LRUCache = require("lru-cache");

export default (options: LRUCache.Options<string, any> = {}, name?: string) => {
    const cache = new LRUCache<string, any>({
        max: 0,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        ...options
    });

    return new BraveCacheProvider(name || "lru-cache", cache, {
        get(key: string) {
            return cache.get(key);
        },

        set(key: string, value: any) {
            return cache.set(key, value);
        },

        remove(key: string) {
            return cache.del(key);
        },

        has(key: string) {
            return cache.has(key);
        },

        flush() {
            return cache.reset();
        }
    });
};
