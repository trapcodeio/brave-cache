/**
 * LRUCacheProvider
 */
import BraveCacheProvider from "../src/provider";
import LRUCache from "lru-cache";

/**
 * LRUCacheProvider
 * @example
 * const cache = new BraveCache("lru-cache");
 * @param options
 * @constructor
 */
export default function LRUCacheProvider(options: LRUCache.Options<any, any> = {} as any) {
    const cache = new LRUCache<string, any>({
        max: 1000,
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
                return cache.set(key, value, { ttl: ttl ? ttl * 1000 : undefined });
            },

            del(key) {
                return cache.delete(key);
            },

            has(key) {
                return cache.has(key);
            },

            flush() {
                return cache.clear();
            },

            keys() {
                return [...cache.keys()] as unknown as string[];
            }
        }
    });
}
