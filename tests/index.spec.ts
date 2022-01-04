import test from "japa";
import { BraveCache } from "../index";

import LRUCacheProvider from "../providers/lru-cache";
import SimpleCache from "./CustomTestProvider";

// Initialize the cache.
test("Register provider", () => {
    BraveCache.registerProvider(LRUCacheProvider());
    BraveCache.registerProvider(LRUCacheProvider(), "lru-cache-2");
});

// Set Default Provider.
test("Set Default Provider", () => {
    BraveCache.setDefaultProvider("lru-cache");
});

test("Initialize new Cache", (assert) => {
    const cache = new BraveCache();
    // Check if set to default provider.
    assert.equal(cache.provider.name, "lru-cache");

    const cache2 = new BraveCache("lru-cache-2");
    // Check if set to defined provider.
    assert.equal(cache2.provider.name, "lru-cache-2");

    // Test if the cache is an instance of the Cache class.
    cache.set("test", "test");
    cache2.set("test2", "test2");

    // Test value
    assert.equal(cache.get("test"), "test");
    assert.equal(cache2.get("test2"), "test2");

    // check if each cache is self-contained.
    assert.isUndefined(cache.get("test2"));
    assert.isUndefined(cache2.get("test"));
});

/**
 * Test if the cache is self-contained.
 */
test("Custom Cache Provider", (assert) => {
    BraveCache.registerProvider(SimpleCache());

    // Initialize new Cache
    const cache = new BraveCache("simple-cache");

    cache.set("provider", "Simple Cache Provider");
    assert.equal(cache.get("provider"), "Simple Cache Provider");

    // Initialize without specifying a provider.
    const cache2 = new BraveCache();
    assert.equal(cache2.provider.name, "lru-cache");
});
