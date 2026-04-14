// Product Categories Backend Endpoints
// Add these to your server.js

// Get category statistics
app.get("/categories/stats", (req, res) => {
  const sql = `
    SELECT 
      p.category,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(DISTINCT p.shop_id) as shop_count,
      COUNT(DISTINCT CASE WHEN p.stock_quantity > 0 THEN p.id END) as available_products,
      MIN(p.price) as lowest_price,
      MAX(p.price) as highest_price,
      AVG(p.price) as average_price
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
    GROUP BY p.category
    ORDER BY product_count DESC
  `;
  
  db.all(sql, [], (err, categories) => {
    if (err) {
      console.error('Error fetching category stats:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(categories);
  });
});

// Get categories by city
app.get("/cities/:city/categories", (req, res) => {
  const city = req.params.city;
  
  const sql = `
    SELECT 
      p.category,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(DISTINCT p.shop_id) as shop_count,
      COUNT(DISTINCT CASE WHEN p.stock_quantity > 0 THEN p.id END) as available_products,
      MIN(p.price) as lowest_price,
      MAX(p.price) as highest_price,
      AVG(p.price) as average_price
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE s.city = ? AND p.status = 'active' AND s.status = 'active'
    GROUP BY p.category
    ORDER BY product_count DESC
  `;
  
  db.all(sql, [city], (err, categories) => {
    if (err) {
      console.error('Error fetching categories by city:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(categories);
  });
});

// Get products by category (and optionally city)
app.get("/products/by-category/:category", (req, res) => {
  const category = req.params.category;
  const { city, brand, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;
  
  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.region as shop_region,
      s.is_verified as shop_verified,
      s.rating as shop_rating,
      u.username as owner_username
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.category = ? AND p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [category];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  if (brand) {
    sql += " AND p.brand = ?";
    params.push(brand);
  }
  
  if (minPrice) {
    sql += " AND p.price >= ?";
    params.push(parseFloat(minPrice));
  }
  
  if (maxPrice) {
    sql += " AND p.price <= ?";
    params.push(parseFloat(maxPrice));
  }
  
  sql += " ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error fetching products by category:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Parse JSON fields
    const processedProducts = products.map(product => ({
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : []
    }));
    
    res.json(processedProducts);
  });
});

// Get popular categories
app.get("/categories/popular", (req, res) => {
  const { city, limit = 8 } = req.query;
  
  let sql = `
    SELECT 
      p.category,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(DISTINCT p.shop_id) as shop_count,
      SUM(p.view_count) as total_views,
      SUM(p.wishlist_count) as total_wishlists
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " GROUP BY p.category ORDER BY product_count DESC, total_views DESC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, categories) => {
    if (err) {
      console.error('Error fetching popular categories:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(categories);
  });
});

// Get category details with top products
app.get("/categories/:category/details", (req, res) => {
  const category = req.params.category;
  const { city, limit = 10 } = req.query;
  
  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.is_verified as shop_verified,
      (p.view_count + p.wishlist_count) as popularity_score
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.category = ? AND p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [category];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " ORDER BY popularity_score DESC, p.created_at DESC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error fetching category details:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Parse JSON fields
    const processedProducts = products.map(product => ({
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : []
    }));
    
    res.json(processedProducts);
  });
});

// Search categories
app.get("/categories/search", (req, res) => {
  const { q, limit = 10 } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }
  
  const sql = `
    SELECT 
      category,
      COUNT(DISTINCT id) as product_count,
      COUNT(DISTINCT shop_id) as shop_count
    FROM products
    WHERE category LIKE ? AND status = 'active'
    GROUP BY category
    ORDER BY product_count DESC
    LIMIT ?
  `;
  
  db.all(sql, [`%${q}%`, parseInt(limit)], (err, categories) => {
    if (err) {
      console.error('Error searching categories:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(categories);
  });
});

// Get category brands
app.get("/categories/:category/brands", (req, res) => {
  const category = req.params.category;
  const { city } = req.query;
  
  let sql = `
    SELECT 
      p.brand,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(DISTINCT p.shop_id) as shop_count,
      MIN(p.price) as lowest_price,
      MAX(p.price) as highest_price
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.category = ? AND p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [category];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " GROUP BY p.brand ORDER BY product_count DESC";
  
  db.all(sql, params, (err, brands) => {
    if (err) {
      console.error('Error fetching category brands:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(brands);
  });
});

// Get category price ranges
app.get("/categories/:category/price-ranges", (req, res) => {
  const category = req.params.category;
  const { city } = req.query;
  
  let sql = `
    SELECT 
      CASE 
        WHEN p.price < 5000 THEN 'Under 5,000'
        WHEN p.price < 10000 THEN '5,000 - 10,000'
        WHEN p.price < 20000 THEN '10,000 - 20,000'
        WHEN p.price < 50000 THEN '20,000 - 50,000'
        ELSE 'Over 50,000'
      END as price_range,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(DISTINCT p.shop_id) as shop_count,
      MIN(p.price) as lowest_price,
      MAX(p.price) as highest_price
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.category = ? AND p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [category];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " GROUP BY price_range ORDER BY MIN(p.price)";
  
  db.all(sql, params, (err, priceRanges) => {
    if (err) {
      console.error('Error fetching category price ranges:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(priceRanges);
  });
});
