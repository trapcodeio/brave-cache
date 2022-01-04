import BraveCacheProvider from "../src/BraveCacheProvider";

export default function SimpleCache() {
    // Holds cache values
    let SimpleCacheStore: Record<string, any> = {};

    // Return provider instance
    return new BraveCacheProvider({
        name: "simple-cache",
        functions: {
            get(key) {
                return SimpleCacheStore[key];
            },

            set(key, value) {
                SimpleCacheStore[key] = value;
            },

            has(key) {
                return SimpleCacheStore.hasOwnProperty(key);
            },

            remove(key) {
                delete SimpleCacheStore[key];
            },

            flush() {
                SimpleCacheStore = {};
            }
        }
    });
}
