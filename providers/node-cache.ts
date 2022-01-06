/**
 * Node Cache Provider
 */
import BraveCacheProvider from "../src/BraveCacheProvider";
import NodeCache from "node-cache";

export default function NodeCacheProvider(options: NodeCache.Options = {}) {
    // Create a new instance of the Node Cache
    const cache = new NodeCache(options);

    return new BraveCacheProvider({
        name: "node-cache",
        client: cache,
        functions: {
            get(key) {
                return cache.get(key);
            },

            set(key, value, ttl) {
                return cache.set(key, value, ttl || 0);
            },

            del(key) {
                return cache.del(key);
            },

            has(key) {
                return cache.has(key);
            },

            flush() {
                return cache.flushAll();
            },

            keys() {
                return cache.keys();
            },

            // Optional functions
            getMany(keys) {
                return cache.mget(keys);
            }
        }
    });
}
