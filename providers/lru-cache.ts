/**
 * LRUCacheProvider
 */
import BraveCacheProvider from "../src/provider";
import LRUCache from "lru-cache";

export default function LRUCacheProvider(options: LRUCache.Options<string, any> = {}) {
    const cache = new LRUCache<string, any>({
        max: 0,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        ...options
    });

    return new BraveCacheProvider({
        name: "lru-cache",
        client: cache,
        functions: {
            get(key) {
                return cache.get(key);
            },

            set(key, value, ttl) {
                // Since LRUCache supports milliseconds instead of seconds, we need to convert.
                return cache.set(key, value, ttl ? ttl * 1000 : undefined);
            },

            del(key) {
                return cache.del(key);
            },

            has(key) {
                return cache.has(key);
            },

            flush() {
                return cache.reset();
            },

            keys() {
                return cache.keys();
            }
        }
    });
}
