import test from "japa";
import BraveCache from "../index";
import BraveCacheProvider from "../src/provider";

/**
 * Test a basic cache provider
 * @param groupName
 * @param provider
 * @constructor
 */
export function TestCacheProvider(groupName: string, provider: BraveCacheProvider) {
    test.group(groupName, (group) => {
        let cache: BraveCache;

        group.before(() => {
            BraveCache.registerProvider(provider);
            cache = new BraveCache(provider.name);
        });

        group.afterEach(async () => {
            await cache.flushAsync();
        });

        test("Is using provider", (assert) => {
            assert.equal(cache.provider.name, provider.name);
        });

        // test get()
        test("get():", (assert) => {
            cache.set("key", "value");
            assert.equal(cache.get("key"), "value");
        });

        // test get() without value
        test("get(): without value", (assert) => {
            assert.isUndefined(cache.get("key"));
        });

        // test get() with default value
        test("get(): with default value", (assert) => {
            let test = cache.get("key", "value");
            assert.equal(test, "value");

            // test with default value as function
            test = cache.get("key", () => "value");
            assert.equal(test, "value");
        });

        // test get()
        test("getAsync():", async (assert) => {
            cache.set("key", "value");
            assert.equal(await cache.getAsync("key"), "value");
        });

        // test get() without value
        test("getAsync(): without value", async (assert) => {
            assert.isUndefined(await cache.getAsync("key"));
        });

        // test getAsync() with default value
        test("getAsync(): with default value", async (assert) => {
            let test: string = await cache.getAsync("fail", "default");
            assert.equal(test, "default");

            // test with default value as promise
            test = await cache.getAsync("key", Promise.resolve("promise"));
            assert.equal(test, "promise");

            // test with default value as function
            test = cache.get("key", () => "value");
            assert.equal(test, "value");

            // test with default value as async function
            test = await cache.getAsync("key", () => Promise.resolve("function"));
            assert.equal(test, "function");
        });

        // test getMany()
        test("getMany():", (assert) => {
            // Set Many
            cache.setMany([
                ["key1", "value1"],
                ["key2", "value2"],
                ["key3", "value3"]
            ]);

            let test = cache.getMany(["key1", "key2", "key3"]);

            assert.equal(test.key1, "value1");
            assert.equal(test.key2, "value2");
            assert.equal(test.key3, "value3");

            // Test without values
            test = cache.getMany(["key1", "key2", "key3", "key4"]);
            // key4 should be undefined
            assert.isUndefined(test.key4);
        });

        // test getManyAsync()
        test("getManyAsync():", async (assert) => {
            // Set Many
            await cache.setManyAsync([
                ["key1", "value1"],
                ["key2", "value2"],
                ["key3", "value3"]
            ]);

            let test = await cache.getManyAsync(["key1", "key2", "key3"]);

            assert.equal(test.key1, "value1");
            assert.equal(test.key2, "value2");
            assert.equal(test.key3, "value3");

            // Test without values
            test = await cache.getManyAsync(["key1", "key2", "key3", "key4"]);
            // key4 should be undefined
            assert.isUndefined(test.key4);
        });

        // test set()
        test("set():", (assert) => {
            cache.set("key", "value");
            assert.equal(cache.get("key"), "value");
        });

        // test setAsync()
        test("setAsync():", async (assert) => {
            await cache.setAsync("key", "value");
            // Using await
            assert.equal(await cache.getAsync("key"), "value");
        });

        // test setMany()
        test("setMany():", (assert) => {
            // Using array syntax
            cache.setMany([
                ["key", "value"],
                ["key2", "value2", 500] // or with TTL in seconds
            ]);

            assert.equal(cache.get("key"), "value");
            assert.equal(cache.get("key2"), "value2");

            // Using object syntax
            cache.setMany([
                { key: "key3", value: "value3" },
                { key: "key4", value: "value4", ttl: 500 } // or with TTL in seconds
            ]);

            assert.equal(cache.get("key3"), "value3");
            assert.equal(cache.get("key4"), "value4");
        });

        // test setManyAsync()
        test("setManyAsync():", async (assert) => {
            // Using array syntax
            await cache.setManyAsync([
                ["key", "value"],
                ["key2", "value2", 500] // or with TTL in seconds
            ]);

            assert.equal(await cache.getAsync("key"), "value");
            assert.equal(await cache.getAsync("key2"), "value2");

            // Using object syntax
            await cache.setManyAsync([
                { key: "key3", value: "value3" },
                { key: "key4", value: "value4", ttl: 500 } // or with TTL in seconds
            ]);

            assert.equal(await cache.getAsync("key3"), "value3");
            assert.equal(await cache.getAsync("key4"), "value4");
        });

        // test getOrSet()
        test("getOrSet():", (assert) => {
            // test with default value
            let test = cache.getOrSet("key", "value");
            assert.equal(test, "value");
            assert.equal(cache.get("key"), "value");

            // test with default value as function that returns value.
            let test2 = cache.getOrSet("key2", () => "value2");
            assert.equal(test2, "value2");
            assert.equal(cache.get("key2"), "value2");
        });

        // test getOrSetAsync()
        test("getOrSetAsync():", async (assert) => {
            // test with default value
            let test = await cache.getOrSetAsync("key", "value");
            assert.equal(test, "value");
            assert.equal(await cache.getAsync("key"), "value");

            // test with default value as function that returns value.
            let test2 = await cache.getOrSetAsync("key2", () => "value2");
            assert.equal(test2, "value2");
            assert.equal(await cache.getAsync("key2"), "value2");

            // test with default value as a function that returns promise.
            let test3 = await cache.getOrSetAsync("key3", () => Promise.resolve("value3"));

            assert.equal(test3, "value3");
            assert.equal(await cache.getAsync("key3"), "value3");
        });

        // test has():
        test("has():", (assert) => {
            cache.set("key", "value");
            assert.isTrue(cache.has("key"));
            assert.isFalse(cache.has("non existing key"));
        });

        // test hasAsync():
        test("hasAsync():", async (assert) => {
            await cache.setAsync("key", "value");
            assert.isTrue(await cache.hasAsync("key"));
            assert.isFalse(await cache.hasAsync("non existent key"));
        });

        // test delete():
        test("delete():", (assert) => {
            cache.set("key", "value");
            assert.isTrue(cache.has("key"));
            cache.remove("key");
            assert.isFalse(cache.has("key"));
        });

        // test deleteAsync():
        test("deleteAsync():", async (assert) => {
            await cache.setAsync("key", "value");
            assert.isTrue(await cache.hasAsync("key"));

            await cache.removeAsync("key");
            assert.isFalse(await cache.hasAsync("key"));
        });

        // test flush():
        test("flush():", (assert) => {
            cache.set("key", "value");
            assert.isTrue(cache.has("key"));
            cache.flush();
            assert.isFalse(cache.has("key"));
        });

        // test flushAsync():
        test("flushAsync():", async (assert) => {
            await cache.setAsync("key", "value");
            assert.isTrue(await cache.hasAsync("key"));

            await cache.flushAsync();
            assert.isFalse(await cache.hasAsync("key"));
        });

        // test keys():
        test("keys():", (assert) => {
            cache.set("key", "value");
            cache.set("key2", "value2");

            const keys = cache.keys();

            assert.equal(keys.length, 2);
            assert.include(keys, "key");
            assert.include(keys, "key2");
        });

        // test keysAsync():
        test("keysAsync():", async (assert) => {
            await cache.setAsync("key", "value");
            await cache.setAsync("key2", "value2");

            const keys = await cache.keysAsync();

            assert.equal(keys.length, 2);
            assert.include(keys, "key");
            assert.include(keys, "key2");
        });

        // test size():
        test("size():", (assert) => {
            cache.set("key", "value");
            cache.set("key2", "value2");

            assert.equal(cache.size(), 2);
        });

        // test sizeAsync():
        test("sizeAsync():", async (assert) => {
            await cache.setAsync("key", "value");
            await cache.setAsync("key2", "value2");

            assert.equal(await cache.sizeAsync(), 2);
        });
    });
}
