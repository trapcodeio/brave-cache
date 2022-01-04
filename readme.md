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

```typescript
import BraveCacheProvider from "brave-cache/src/BraveCacheProvider"; 

// config - any configuration required by the provider
// name - name of the provider
function SimpleCache(config?: any, name?: string) {
    // Holds cache values
    const SimpleCacheStore = {};
    
    return new BraveCacheProvider(name || 'simple-cache')
}
```