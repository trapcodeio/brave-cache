/**
 * Memory cache using object collection.
 */
import BraveCacheProvider from "../src/provider";
import ObjectCollection from "object-collection";

/**
 * Memory cache using object collection.
 * @example
 * const cache = new BraveCache("object-cache");
 * @param data
 * @constructor
 */
export default function ObjectCacheProvider(data?: Record<string, any>) {
    const cache = new ObjectCollection<Record<string, any>>(data || {});

    return new BraveCacheProvider({
        name: "object-cache",
        // Grinding
        client: cache,

        functions: {
            get(key) {
                return cache.get(key);
            },

            set(key, value) {
                return cache.set(key, value);
            },

            del(key) {
                return cache.unset(key);
            },

            has(key) {
                return cache.has(key);
            },

            flush() {
                cache.replaceData({});
            },

            keys() {
                return cache.keys();
            },

            // Optional functions
            getMany(keys) {
                return cache.pick(keys);
            }
        }
    });
}
