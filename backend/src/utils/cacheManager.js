// Cache management utility for better performance
class CacheManager {
    constructor() {
        this.caches = new Map();
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0
        };

        // Cleanup expired entries every 5 minutes
        setInterval(() => {
            this.cleanup();
        }, 5 * 60 * 1000);
    }

    // Create a new cache with TTL
    createCache(name, ttl = 5 * 60 * 1000) {
        this.caches.set(name, {
            data: new Map(),
            ttl: ttl,
            created: Date.now()
        });
        return this;
    }

    // Get value from cache
    get(cacheName, key) {
        const cache = this.caches.get(cacheName);
        if (!cache) {
            this.stats.misses++;
            return null;
        }

        const entry = cache.data.get(key);
        if (!entry) {
            this.stats.misses++;
            return null;
        }

        if (Date.now() - entry.timestamp > cache.ttl) {
            cache.data.delete(key);
            this.stats.misses++;
            return null;
        }

        this.stats.hits++;
        return entry.data;
    }

    // Set value in cache
    set(cacheName, key, value) {
        const cache = this.caches.get(cacheName);
        if (!cache) {
            this.createCache(cacheName);
        }

        this.caches.get(cacheName).data.set(key, {
            data: value,
            timestamp: Date.now()
        });
        this.stats.sets++;
        return this;
    }

    // Delete value from cache
    delete(cacheName, key) {
        const cache = this.caches.get(cacheName);
        if (cache && cache.data.delete(key)) {
            this.stats.deletes++;
        }
        return this;
    }

    // Clear entire cache
    clear(cacheName) {
        const cache = this.caches.get(cacheName);
        if (cache) {
            cache.data.clear();
        }
        return this;
    }

    // Cleanup expired entries
    cleanup() {
        const now = Date.now();
        for (const [cacheName, cache] of this.caches) {
            for (const [key, entry] of cache.data) {
                if (now - entry.timestamp > cache.ttl) {
                    cache.data.delete(key);
                }
            }
        }
    }

    // Get cache statistics
    getStats() {
        const cacheSizes = {};
        for (const [name, cache] of this.caches) {
            cacheSizes[name] = cache.data.size;
        }

        return {
            ...this.stats,
            cacheSizes,
            hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0
        };
    }

    // Clear all caches
    clearAll() {
        this.caches.clear();
        this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };
        return this;
    }
}

// Create global cache manager instance
const cacheManager = new CacheManager();

// Create specific caches
cacheManager.createCache('objects', 5 * 60 * 1000); // 5 minutes for object details
cacheManager.createCache('departments', 10 * 60 * 1000); // 10 minutes for departments

module.exports = cacheManager;