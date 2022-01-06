import { BraveCache } from "../index";
import test from "japa";
import BraveCacheProvider from "../src/BraveCacheProvider";

export function TestBraveInstanceMethods(groupName: string, provider: BraveCacheProvider) {
    test.group(groupName, (group) => {
        let cache: BraveCache;

        group.afterEach(async () => {
            await cache.flushAsync();
        });

        test("Can be registered and initialized", (assert) => {
            BraveCache.registerProvider(provider);

            cache = new BraveCache(provider.name);

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
            let test = await cache.getAsync("fail", "default");
            assert.equal(test, "default");

            // test with default value as function
            test = cache.get("key", () => "value");
            assert.equal(test, "value");

            // test with default value as async function
            test = await cache.getAsync("key", () => Promise.resolve("value"));

            assert.equal(test, "value");
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
