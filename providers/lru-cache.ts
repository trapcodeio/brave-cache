import BraveCacheProvider from "../src/BraveCacheProvider";
import LRUCache = require("lru-cache");

export default (options: LRUCache.Options<string, any> = {}) => {
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

            set(key, value) {
                return cache.set(key, value);
            },

            remove(key) {
                return cache.del(key);
            },

            has(key) {
                return cache.has(key);
            },

            flush() {
                return cache.reset();
            }
        }
    });
};
