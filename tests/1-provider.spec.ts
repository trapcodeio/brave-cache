import test from "japa";
import { BraveCache } from "../index";
import BraveCacheProvider from "../src/BraveCacheProvider";

test.group("Register Provider Validator", () => {
    test.failing("Provider must have a name.", () => {
        BraveCache.registerProvider(new BraveCacheProvider({} as any));
    });

    test.failing("Providers must have all functions", () => {
        BraveCache.registerProvider(
            new BraveCacheProvider({
                name: "New Cache",
                functions: {} as any
            })
        );
    });
});

/**
 * Test all out-of-the-box providers
 */
import LRUCacheProvider from "../providers/lru-cache";
import { TestBraveInstanceMethods } from "./helpers";
import ObjectCacheProvider from "../providers/object-cache";

// Set an array of providers to test
const providers: BraveCacheProvider[] = [
    // prettier-ignore
    ObjectCacheProvider(),
    LRUCacheProvider()
];

// loop through each provider and test it
for (const provider of providers) {
    TestBraveInstanceMethods(`Test Provider: [${provider.name}]`, provider);
}
