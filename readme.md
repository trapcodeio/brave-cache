# Brave Cache

Brave Cache is a simple caching library **manager** for Nodejs.

NodeJs Ecosystem already has lots of caching libraries and this is not one of them, but they are not **merge-able** and consists of **different apis.**
Brave Cache supports adding multiple cache providers/drivers while keeping same api.

## Table of Contents

-   [Why Brave Cache?](#why-brave-cache)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Providers](#providers)
-   [Register Provider](#register-provider)
-   [Cache Instance Api](#cache-instance-api)
    -   [get](#get) or [getAsync](#getasync)
    -   [getMany](#getmany) or [getManyAsync](#getmanyasync)
    -   [set](#set) or [setAsync](#setasync)
    -   [setMany](#setmany) or [setManyAsync](#setmanyasync)
    -   [getOrSet](#getorset) or [getOrSetAsync](#getorsetasync)
    -   [has](#has) or [hasAsync](#hasasync)
    -   [del](#del) or [delAsync](#delasync)
    -   [remove](#remove) or [removeAsync](#removeasync)
    -   [keys](#keys) or [keysAsync](#keysasync)
    -   [keysWithPrefix](#keyswithprefix) or [keysWithPrefixAsync](#keyswithprefixasync)
    -   [flush](#flush) or [flushAsync](#flushasync)
    -   [size](#size) or [sizeAsync](#sizeasync)
-   [Create Custom Provider](#create-custom-provider)
-   [Use Custom Provider](#use-custom-provider)

## Why Brave Cache?

-   Support **multiple** cache providers/drivers
-   Support key prefixing.
-   Provides **rare** functions for managing multiple caches.
-   Provides **sync** and **async** methods for managing caches.
-   One **Api** for all cache providers/drivers
-   Easy to create your own custom cache system if need be.

## Installation

```sh
npm install brave-cache
# OR
yarn add brave-cache
```

## Usage

```js
const BraveCache = require("brave-cache");

// Create Cache, it will use the default provider
const cache = new BraveCache();
cache.set("pet", "cat");

console.log(cache.get("pet")); // "cat"

// You can also access the provider
cache.provider.client.set("direct", "direct");

console.log(cache.get("direct")); // => direct
console.log(cache.provider.client.get("direct")); // => direct
```

## Providers

Out of the box, BraveCache provides supports for the following cache libraries:

-   Object Cache using [object-collection](https://npmjs.com/package/object-collection) (default)
-   [LRU Cache](http://npmjs.com/package/lru-cache) (requires package: `lru-cache`)
-   [Node Cache](https://www.npmjs.com/package/node-cache) (requires package: `node-cache`)

The default Provider is `ObjectCacheProvider` which uses [`object-collection`](https://npmjs.com/package/object-collection) to store the cache data in an object.
It has been registered by default.

## Register Provider

The `registerProvider` method can be used to register a custom provider.

it takes two arguments:

| Argument   | Type     | Description                                               |
| ---------- | -------- | --------------------------------------------------------- |
| `provider` | `object` | The provider object i.e. instance of `BraveCacheProvider` |
| `as`       | `string` | Custom name of the provider (optional)                    |

```js
const BraveCache = require("brave-cache");
const LRUCacheProvider = require("brave-cache/providers/lru-cache");

// default name is `lru-cache`
BraveCache.registerProvider(LRUCacheProvider());
// custom name as `my-cache`
BraveCache.registerProvider(LRUCacheProvider(), "my-cache");
// custom name as `my-cache-2` and max size of 50
BraveCache.registerProvider(LRUCacheProvider({ max: 50 }), "my-cache-2");

const cache = new BraveCache("lru-cache");
const cache2 = new BraveCache("my-cache");
const cache3 = new BraveCache("my-cache-2");
```

Providers are registered and accessed by their names.

## Prefix support.

Brave Cache adds prefix support to the cache keys without needing the provider to do it.
on `get` and `set` methods the prefix will be added.

The example below is how brave cache works without prefix.

```js
// will use default provider (ObjectCacheProvider)
const cache1 = new BraveCache();
const cache2 = new BraveCache();

// cache1 and cache2 will have same data
cache1.set("test", "from cache1");
// this will overwrite the value for `test` in cache1
cache2.set("test", "from cache2");

cache1.get("test"); // => from cache2
cache2.get("test"); // => from cache2
```

`cache1` and `cache2` will have same data because they are both using the same provider and without prefix you are referring to the same key in one provider.

The example below is how brave cache works with prefix.

```js
// will use default provider (ObjectCacheProvider)
const cache1 = new BraveCache({ prefix: "cache1" });
const cache2 = new BraveCache({ prefix: "cache2" });
const cache3 = new BraveCache(); // no prefix

cache1.set("test", "from cache1");

cache2.set("test", "from cache2");
cache2.set("test2", "another value from cache2");

cache1.get("test"); // => from cache1
cache1.get("test2"); // => undefined

cache2.get("test"); // => from cache
cache2.get("test2"); // => another value from cache2

cache1.size(); // => 1
cache2.size(); // => 2
cache3.size(); // => 3
```

`cache1` and `cache2` will not have same date because they are using different prefix. Meanwhile `cache3` will have `cache1 + cache2` data because they all reference the same provider instance.

## Cache Instance Api

These are the functions available on the cache instance. Unlike other cache packages, all instance methods come in both `sync` and `async` versions.

Note: `Async` methods will only work if your provider supports async operations. most cache libraries do not support async operations.

Example of a cache instance.

```js
const cache = new BraveCache();
// or specify a provider
const cache = new BraveCache("object-cache");
```

### get()

Get a value from the cache.

```js
cache.set("key", "value");

cache.get("key"); // => "value"
cache.get("non existent key"); // => undefined

// cache with default value
cache.get("non existent key", "default value"); // => "default value"

// Or with default value computed from a function
cache.get("non existent key", () => "default value"); // => "default value"
```

### getAsync()

Async version of `get()`, Includes all the functionalities of `get()` with extra capability to resolve promises or functions that return promises.

```js
// Includes all the functionality of get()
// Or with default value as a promise
await cache.getAsync("non existent key", Promise.resolve("default value")); // => "default value"

// Or with default value computed from a function
await cache.getAsync("non existent key", () => "default value"); // => "default value"

// Or with default value computed from a function that returns a promise
await cache.getAsync("non existent key", () => Promise.resolve("default value")); // => "default value"
```

### getMany()

Get multiple values at once. keys that do not exist will be ignored.

```js
// Set Many
cache.setMany([
    ["key1", "value1"],
    ["key2", "value2"],
    ["key3", "value3"]
]);

let test = cache.getMany(["key1", "key2", "key3", "key4"]);

console.log(test.key1); // => "value1";
console.log(test.key2); // => "value2";
console.log(test.key3); // => "value3";
console.log(test.key4); // => undefined;
```

### getManyAsync()

Async version of `getMany()`

### set()

Set a value in the cache.

```js
cache.set("key", "value"); // set key to value
```

### setAsync()

Async version of `set()`

### setMany()

Set multiple values at once.

```js
// using array of key value pairs
cache.setMany([
    ["key1", "value1"],
    ["key2", "value2", 500] // with TTL
]);

// using object
cache.setMany([
    { key: "key3", value: "value3" },
    { key: "key4", value: "value4", ttl: 500 } // or with TTL in seconds
]);

console.log(cache.keys()); // => ["key1", "key2", "key3", "key4"]
```

### setManyAsync()

Async version of `setMany()`

### getOrSet()

Find a value in the cache. If it does not exist, set it to the default value.

```js
cache.getOrSet("username", "joe"); // => "joe"

// cache should have username set to joe
cache.has("username"); // => true

// Trying again will return the value set in the cache
cache.getOrSet("username", "john"); // => "joe" because joe is still in the cache

// Functions can be used as default values
cache.getOrSet("email", () => "joe@example.com"); // => "joe@example.com"
```

### getOrSetAsync()

Async version of `getOrSet()`

### has()

Check if key exists in the cache.

```js
cache.set("pet", "cat");

cache.has("pet"); // => true
cache.has("pet2"); // => false
```

### hasAsync()

Async version of `has()`

### del()

Delete a key from the cache.

```js
cache.set("pet", "dog");

cache.del("pet");

cache.has("pet"); // => false
```

### delAsync()

Async version of `del()`

### remove()

Alias for `del()`

### removeAsync()

Alias for `delAsync()`

### Keys()

Get all the keys in the cache.

```js
cache.setMany([
    ["pet", "dog"],
    ["username", "joe"],
    ["email", "joe@example.com"]
]);

cache.keys(); // => ["pet", "username", "email"]
```

### keysAsync()

Async version of `keys()`

### keysWithPrefix()

```js
const cache = new BraveCache({ prefix: "a" });

cache.setMany([
    ["pet", "dog"],
    ["username", "joe"],
    ["email", "joe@example.com"]
]);

cache.keys(); // => ["pet", "username", "email"]
cache.keysWithPrefix(); // => ["a:pet", "a:username", "a:email"]
```

### keysWithPrefixAsync()

Async version of `keysWithPrefix()`

### flush()

Empty the cache completely.

### flushAsync()

Async version of `flush()`

### size()

Get the number of items in the cache.

### sizeAsync()

Async version of `size()`

## Create Custom Provider

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

Functions to be implemented: `get`, `set`, `has`, `del`, `flush`, `keys`

Optional functions: `getMany`

Note: if any optional function is not implemented, BraveCache in house function will be used instead.

### Use Custom Provider

A custom Provider function can include arguments that are related to the provider.

```js
const BraveCache = require("brave-cache");

// Register Simple Cache Above
BraveCache.registerProvider(SimpleCache());

const cache = new BraveCache("simple-cache"); // `simple-cache` is the name of the provider

cache.set("test", "value");

console.log(cache.get("test")); // => value
```
