# Brave Cache

Brave Cache is a simple caching library **manager** for Nodejs.

NodeJs Ecosystem already has lots of caching libraries and this is not one of them, but they are not **merge-able** and consists of **different apis.**
Brave Cache supports adding multiple cache providers/drivers while keeping same api.

## Why use Brave Cache?
BraveCache provides extra **rare** functions for managing multiple caches. By **rare** we mean functions not included 
in the majority of cache packages out there but required in modern day applications.

## Installation
```sh
npm install brave-cache
# OR
yarn add brave-cache
```

## Usage
```js
const BraveCache = require('brave-cache');
const LRUCacheProvider = require('brave-cache/providers/lru-cache');

// Register a Provider
BraveCache.registerProvider(LRUCacheProvider({
  // LRU Cache Options
}));

// Create Cache, it will use LRUCache
const cache = new BraveCache();
cache.set("test", "test");

console.log(cache.get("test"))

// You can also access the provider i.e lru-cache directly
cache.provider.client.set("direct", "direct") // => LRUCache

console.log(cache.get("direct")) // => direct
console.log(cache.provider.client.get("direct")) // => direct
```

## Cache Instance Api
These are the functions available on the cache instance. Unlike other cache packages, all instance methods come in both `sync` and `async` versions.

Example of a cache instance.
```js
const cache = new BraveCache();
// or specify a provider
const cache = new BraveCache("object-cache")
```

### get()


## Providers
Out of the box, BraveCache provides supports for the  following cache libraries:

- Object Cache using [object-collection](https://npmjs.com/package/object-collection) (default)
- [LRU Cache](http://npmjs.com/package/lru-cache) (requires: `lru-cache`)
- [Node Cache](https://www.npmjs.com/package/node-cache) (requires: `node-cache`)

The default Provider is `ObjectCacheProvider` which uses [`object-collection`](https://npmjs.com/package/object-collection) to store the cache data in an object.
It has been registered by default.


## Creating a Custom Provider
Basically all nodejs `cache` modules have similar api, so creating a custom provider is easy.

A custom provider is a `function` that takes any necessary configuration and returns a `BraveCacheProvider` class instance.

```js
const BraveCacheProvider = require("brave-cache/src/BraveCacheProvider"); 

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

            del(key) {
                delete SimpleCacheStore[key];
            },

            flush() {
                SimpleCacheStore = {};
            },
            
            keys() {
                return Object.keys(SimpleCacheStore);
            }
        }
    });
}
```

From the example above, the `SimpleCache` provider is a simple implementation of how to create a cache Provider.

Notice that you have to implement all the functions that are required by the `BraveCacheProvider` class.
These functions will be used when accessing the cache.

### Using A Custom Provider
A custom Provider function can include arguments that are related to the provider.

```js
const BraveCache = require('brave-cache');

// Register Simple Cache Above
BraveCache.registerProvider(SimpleCache());

const cache = new BraveCache(); // or new BraveCache("simple-cache"); if simple-cache is not set as default provider.

cache.set("test", "value");

console.log(cache.get("test")) // => value
```