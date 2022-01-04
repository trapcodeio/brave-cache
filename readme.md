# Brave Cache

Brave Cache is a simple, fast, and secure caching library **manager** for Nodejs.

NodeJs Ecosystem already has lots of caching libraries and this is not one of them, but they are not merge-able and consists of different apis.
For example lets assume i want to use two cache systems: `redis` and `node-cache`. Brave Cache supports adding multiple cache providers/drivers while keeping same api.

## Installation
```sh
npm install brave-cache
# OR
yarn add brave-cache
```

## Usage
```js
const {BraveCache} = require('brave-cache');
const LRUCacheProvider = require('brave-cache/providers/lru-cache');

// Register Provider
BraveCache.registerProvider(LRUCacheProvider());

// Create Cache, it will use LRUCache
const cache = new BraveCache();

cache.set("test", "test");

console.log(cache.get("test"))

// You can also access the provider i.e lru-cache directly
cache.provider.client.set("direct", "direct") // => LRUCache

console.log(cache.get("direct")) // => direct
console.log(cache.provider.client.get("direct")) // => direct
```

## Creating a Custom Provider
Basically all nodejs `cache` modules have similar api, so creating a custom provider is easy.

A custom provider is a function that takes any necessary configuration and returns a `BraveCacheProvider` class instance.

```js
import BraveCacheProvider from "brave-cache/src/BraveCacheProvider"; 

function SimpleCache() {
    // Holds cache values
    let SimpleCacheStore = {};

    // Return provider instance
    return new BraveCacheProvider({
        name,

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
```

From the example above, the `SimpleCache` provider is a simple implementation of how to create a cache Provider.

Notice that you have to implement all the functions that are required by the `BraveCacheProvider` class.
These functions will be used when accessing the cache.

### Using A Custom Provider

```js
const {BraveCache} = require('brave-cache');

// Register Simple Cache Above
BraveCache.registerProvider(SimpleCache());

const cache = new BraveCache(); // or new BraveCache("simple-cache"); if simple-cache is not set as default provider.

cache.set("test", "test");

console.log(cache.get("test"))
```

More implementations can be found in test files