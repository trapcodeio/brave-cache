import test from "japa";
import BraveCache from "../index";
import BraveCacheProvider from "../src/provider";

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
import { TestCacheProvider } from "./helpers";
import ObjectCacheProvider from "../providers/object-cache";
import NodeCacheProvider from "../providers/node-cache";
import RandomWords from "random-words";

// Set an array of providers to test
const providers: BraveCacheProvider[] = [
    // prettier-ignore
    ObjectCacheProvider(),
    NodeCacheProvider(),
    LRUCacheProvider()
];

// loop through each provider and test it
for (const provider of providers) {
    TestCacheProvider(`Test Provider: [${provider.name}]`, provider);
}

// Test each provider with a prefix
// Generate random words to use as prefix for each provider
const randomWords = RandomWords(providers.length);

for (const index in providers) {
    const provider = providers[index];
    const prefix = randomWords[index];

    TestCacheProvider(
        `Test Provider: [${provider.name}] With Prefix: [${prefix}]`,
        provider,
        prefix
    );
}
