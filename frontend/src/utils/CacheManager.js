// Advanced Caching System for Ethiopian Electronics Marketplace
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
    
    // Default TTL values (in milliseconds)
    this.defaultTTL = {
      products: 300000,      // 5 minutes
      categories: 600000,    // 10 minutes
      shops: 300000,        // 5 minutes
      search: 180000,       // 3 minutes
      user: 900000,         // 15 minutes
      images: 3600000        // 1 hour
    };
  }

  // Set cache with TTL
  set(key, value, customTTL = null) {
    const ttl = customTTL || this.defaultTTL[this.getCategory(key)] || 300000;
    const expiry = Date.now() + ttl;
    
    this.cache.set(key, {
      value,
      expiry,
      timestamp: Date.now()
    });
    
    this.ttl.set(key, expiry);
    this.stats.sets++;
    
    // Auto-cleanup expired items
    this.cleanup();
  }

  // Get from cache
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      return null;
    }
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      this.ttl.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return item.value;
  }

  // Check if exists and not expired
  has(key) {
    return this.get(key) !== null;
  }

  // Delete specific key
  delete(key) {
    this.cache.delete(key);
    this.ttl.delete(key);
    this.stats.deletes++;
  }

  // Clear all cache
  clear() {
    this.cache.clear();
    this.ttl.clear();
    this.stats = { hits: 0, misses: 0, sets: 0, deletes: 0 };
  }

  // Cleanup expired items
  cleanup() {
    const now = Date.now();
    for (const [key, expiry] of this.ttl.entries()) {
      if (now > expiry) {
        this.cache.delete(key);
        this.ttl.delete(key);
      }
    }
  }

  // Get cache category from key
  getCategory(key) {
    if (key.includes('product')) return 'products';
    if (key.includes('category')) return 'categories';
    if (key.includes('shop')) return 'shops';
    if (key.includes('search')) return 'search';
    if (key.includes('user')) return 'user';
    if (key.includes('image')) return 'images';
    return 'default';
  }

  // Get cache statistics
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;
    
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
      cacheSize: this.cache.size
    };
  }

  // Cache middleware for Express
  middleware() {
    return (req, res, next) => {
      const cacheKey = `cache:${req.originalUrl}`;
      const cached = this.get(cacheKey);
      
      if (cached) {
        res.set('X-Cache', 'HIT');
        res.set('X-Cache-Hit-Rate', this.getStats().hitRate);
        return res.json(cached);
      }
      
      res.set('X-Cache', 'MISS');
      
      // Override res.json to cache response
      const originalJson = res.json;
      res.json = (data) => {
        this.set(cacheKey, data, 60000); // Cache for 1 minute
        originalJson.call(res, data);
      };
      
      next();
    };
  }
}

module.exports = CacheManager;
