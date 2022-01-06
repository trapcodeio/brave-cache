/**
 * Memory cache using object collection.
 */

import BraveCacheProvider from "../src/BraveCacheProvider";
import { Obj } from "object-collection/exports";

export default function ObjectCacheProvider(data?: Record<string, any>) {
    const cache = Obj<Record<string, any>>(data || {});

    return new BraveCacheProvider({
        name: "object-cache",
        client: cache,

        functions: {
            get(key) {
                return cache.get(key);
            },

            set(key, value, ttl) {
                // if ttl is not provided, use setTimeout to unset the value
                if (ttl) {
                    setTimeout(() => cache.unset(key), ttl * 1000);
                }

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
