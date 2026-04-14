// Database Indexing for Ethiopian Electronics Marketplace
class DatabaseIndexer {
  constructor(db) {
    this.db = db;
    this.indexes = new Map();
    this.indexStats = {
      products: 0,
      shops: 0,
      categories: 0,
      users: 0
    };
  }

  // Create performance indexes
  createAllIndexes() {
    console.log('🚀 Creating database indexes for optimal performance...');
    
    // Product indexes
    this.createProductIndexes();
    
    // Shop indexes
    this.createShopIndexes();
    
    // User indexes
    this.createUserIndexes();
    
    // Search indexes
    this.createSearchIndexes();
    
    console.log('✅ All database indexes created successfully');
    this.logIndexStats();
  }

  // Product-specific indexes
  createProductIndexes() {
    const productIndexes = [
      // Primary search indexes
      'CREATE INDEX IF NOT EXISTS idx_products_name ON products(name)',
      'CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand)',
      'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)',
      'CREATE INDEX IF NOT EXISTS idx_products_price ON products(price)',
      'CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity)',
      'CREATE INDEX IF NOT EXISTS idx_products_shop ON products(shop_id)',
      
      // Composite indexes for common queries
      'CREATE INDEX IF NOT EXISTS idx_products_category_brand ON products(category, brand)',
      'CREATE INDEX IF NOT EXISTS idx_products_shop_category ON products(shop_id, category)',
      'CREATE INDEX IF NOT EXISTS idx_products_price_stock ON products(price, stock_quantity)',
      'CREATE INDEX IF NOT EXISTS idx_products_name_category ON products(name, category)',
      
      // Full-text search index
      'CREATE VIRTUAL TABLE IF NOT EXISTS products_fts USING fts5(name, description, brand, category)',
      
      // Performance indexes
      'CREATE INDEX IF NOT EXISTS idx_products_created ON products(created_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_products_updated ON products(updated_at DESC)',
      'CREATE INDEX IF NOT EXISTS idx_products_popularity ON products(views DESC, inquiries DESC)'
    ];

    productIndexes.forEach(sql => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('❌ Error creating product index:', err.message);
        } else {
          this.indexStats.products++;
        }
      });
    });
  }

  // Shop-specific indexes
  createShopIndexes() {
    const shopIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_shops_name ON shops(electronicsHouseName)',
      'CREATE INDEX IF NOT EXISTS idx_shops_city ON shops(city)',
      'CREATE INDEX IF NOT EXISTS idx_shops_verified ON shops(is_verified)',
      'CREATE INDEX IF NOT EXISTS idx_shops_active ON shops(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_shops_location ON shops(city, region)',
      'CREATE INDEX IF NOT EXISTS idx_shops_created ON shops(created_at DESC)',
      
      // Composite indexes
      'CREATE INDEX IF NOT EXISTS idx_shops_city_verified ON shops(city, is_verified)',
      'CREATE INDEX IF NOT EXISTS idx_shops_active_verified ON shops(is_active, is_verified)',
      
      // Full-text search index
      'CREATE VIRTUAL TABLE IF NOT EXISTS shops_fts USING fts5(electronicsHouseName, description, city)'
    ];

    shopIndexes.forEach(sql => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('❌ Error creating shop index:', err.message);
        } else {
          this.indexStats.shops++;
        }
      });
    });
  }

  // User-specific indexes
  createUserIndexes() {
    const userIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_city ON users(city)',
      'CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC)',
      
      // Composite indexes
      'CREATE INDEX IF NOT EXISTS idx_users_role_city ON users(role, city)',
      'CREATE INDEX IF NOT EXISTS idx_users_active_role ON users(is_active, role)'
    ];

    userIndexes.forEach(sql => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('❌ Error creating user index:', err.message);
        } else {
          this.indexStats.users++;
        }
      });
    });
  }

  // Search-specific indexes
  createSearchIndexes() {
    const searchIndexes = [
      // Index for search performance
      'CREATE INDEX IF NOT EXISTS idx_search_results_type ON search_results(type)',
      'CREATE INDEX IF NOT EXISTS idx_search_results_query ON search_results(query)',
      'CREATE INDEX IF NOT EXISTS idx_search_results_created ON search_results(created_at DESC)',
      
      // Category search optimization
      'CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name)',
      'CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id)',
      
      // Location-based search indexes
      'CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city)',
      'CREATE INDEX IF NOT EXISTS idx_locations_region ON locations(region)',
      'CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude)'
    ];

    searchIndexes.forEach(sql => {
      this.db.run(sql, (err) => {
        if (err) {
          console.error('❌ Error creating search index:', err.message);
        } else {
          this.indexStats.categories++;
        }
      });
    });
  }

  // Optimized search with indexes
  searchProducts(query, filters = {}) {
    let sql = `
      SELECT p.*, s.electronicsHouseName as shop_name, s.city as shop_city,
      CASE WHEN p.stock_quantity > 0 THEN 1 ELSE 0 END as in_stock
      FROM products p
      JOIN shops s ON p.shop_id = s.id
      WHERE 1=1
    `;
    
    const params = [];

    // Text search using FTS
    if (query) {
      sql += ` AND p.id IN (
        SELECT id FROM products_fts 
        WHERE products_fts MATCH ?
      )`;
      params.push(query);
    }

    // Category filter
    if (filters.category) {
      sql += ` AND p.category = ?`;
      params.push(filters.category);
    }

    // Brand filter
    if (filters.brand) {
      sql += ` AND p.brand = ?`;
      params.push(filters.brand);
    }

    // Price range filter
    if (filters.minPrice) {
      sql += ` AND p.price >= ?`;
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      sql += ` AND p.price <= ?`;
      params.push(filters.maxPrice);
    }

    // In stock filter
    if (filters.inStock) {
      sql += ` AND p.stock_quantity > 0`;
    }

    // City filter
    if (filters.city) {
      sql += ` AND s.city = ?`;
      params.push(filters.city);
    }

    // Ordering with indexes
    const orderBy = filters.sortBy || 'relevance';
    switch (orderBy) {
      case 'price_low':
        sql += ` ORDER BY p.price ASC`;
        break;
      case 'price_high':
        sql += ` ORDER BY p.price DESC`;
        break;
      case 'newest':
        sql += ` ORDER BY p.created_at DESC`;
        break;
      case 'popular':
        sql += ` ORDER BY p.views DESC, p.inquiries DESC`;
        break;
      default:
        sql += ` ORDER BY p.name ASC`;
    }

    // Limit with pagination
    sql += ` LIMIT ? OFFSET ?`;
    params.push(filters.limit || 20, filters.offset || 0);

    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get index statistics
  getIndexStats() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT 
          name,
          tbl_name,
          sql
        FROM sqlite_master 
        WHERE type = 'index' 
        AND tbl_name NOT LIKE 'sqlite_%'
        ORDER BY tbl_name, name
      `, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Analyze query performance
  analyzeQuery(query, params = []) {
    return new Promise((resolve, reject) => {
      // Add EXPLAIN QUERY PLAN
      const explainQuery = `EXPLAIN QUERY PLAN ${query}`;
      
      this.db.all(explainQuery, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const analysis = {
            query,
            plan: rows,
            usingIndexes: rows.some(row => row.detail.includes('USING INDEX')),
            tableScan: rows.some(row => row.detail.includes('SCAN TABLE')),
            cost: rows.reduce((sum, row) => sum + (row.cost || 0), 0)
          };
          resolve(analysis);
        }
      });
    });
  }

  // Log index statistics
  logIndexStats() {
    console.log('📊 Database Index Statistics:');
    console.log(`   Products: ${this.indexStats.products} indexes`);
    console.log(`   Shops: ${this.indexStats.shops} indexes`);
    console.log(`   Categories: ${this.indexStats.categories} indexes`);
    console.log(`   Users: ${this.indexStats.users} indexes`);
    console.log(`   Total: ${Object.values(this.indexStats).reduce((a, b) => a + b, 0)} indexes created`);
  }

  // Optimize database
  optimizeDatabase() {
    console.log('🔧 Optimizing database...');
    
    // Analyze tables for query planner
    this.db.run('ANALYZE', (err) => {
      if (err) {
        console.error('❌ Error analyzing database:', err.message);
      } else {
        console.log('✅ Database analyzed successfully');
      }
    });

    // Vacuum to rebuild database
    this.db.run('VACUUM', (err) => {
      if (err) {
        console.error('❌ Error vacuuming database:', err.message);
      } else {
        console.log('✅ Database vacuumed successfully');
      }
    });

    // Rebuild indexes
    this.db.run('REINDEX', (err) => {
      if (err) {
        console.error('❌ Error reindexing database:', err.message);
      } else {
        console.log('✅ Database reindexed successfully');
      }
    });
  }
}

module.exports = DatabaseIndexer;
