// City Statistics Backend Endpoints
// Add these to your server.js

// Get city statistics (shops and products per city)
app.get("/cities/stats", (req, res) => {
  const sql = `
    SELECT 
      s.city,
      COUNT(DISTINCT s.id) as shops,
      COUNT(DISTINCT p.id) as products,
      COUNT(DISTINCT CASE WHEN p.stock_quantity > 0 THEN p.id END) as available_products
    FROM shops s
    LEFT JOIN products p ON s.id = p.shop_id AND p.status = 'active'
    WHERE s.status = 'active'
    GROUP BY s.city
    ORDER BY shops DESC, products DESC
  `;
  
  db.all(sql, [], (err, cities) => {
    if (err) {
      console.error('Error fetching city stats:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Convert to object format for easy lookup
    const cityStats = {};
    cities.forEach(city => {
      cityStats[city.city] = {
        shops: city.shops,
        products: city.products,
        available_products: city.available_products
      };
    });
    
    res.json(cityStats);
  });
});

// Get shops by city
app.get("/shops/by-city/:city", (req, res) => {
  const city = req.params.city;
  
  const sql = `
    SELECT 
      s.*,
      u.username as owner_username,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(DISTINCT CASE WHEN p.stock_quantity > 0 THEN p.id END) as available_products,
      COALESCE(AVG(r.rating), 0) as rating,
      COUNT(DISTINCT r.id) as review_count
    FROM shops s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN products p ON s.id = p.shop_id AND p.status = 'active'
    LEFT JOIN reviews r ON s.id = r.shop_id
    WHERE s.city = ? AND s.status = 'active'
    GROUP BY s.id
    ORDER BY s.is_verified DESC, s.rating DESC
  `;
  
  db.all(sql, [city], (err, shops) => {
    if (err) {
      console.error('Error fetching shops by city:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(shops);
  });
});

// Get products by city
app.get("/products/by-city/:city", (req, res) => {
  const city = req.params.city;
  const { category, brand, minPrice, maxPrice, limit = 20, offset = 0 } = req.query;
  
  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.is_verified as shop_verified,
      s.rating as shop_rating,
      u.username as owner_username
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE s.city = ? AND p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [city];
  
  if (category) {
    sql += " AND p.category = ?";
    params.push(category);
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
      console.error('Error fetching products by city:', err);
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

// Get all cities with shops
app.get("/cities/with-shops", (req, res) => {
  const sql = `
    SELECT 
      DISTINCT s.city,
      COUNT(DISTINCT s.id) as shop_count,
      COUNT(DISTINCT p.id) as product_count,
      s.region
    FROM shops s
    LEFT JOIN products p ON s.id = p.shop_id AND p.status = 'active'
    WHERE s.status = 'active'
    GROUP BY s.city, s.region
    ORDER BY shop_count DESC, product_count DESC
  `;
  
  db.all(sql, [], (err, cities) => {
    if (err) {
      console.error('Error fetching cities with shops:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(cities);
  });
});

// Search cities (live search)
app.get("/cities/search", (req, res) => {
  const { q, limit = 10 } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }
  
  const sql = `
    SELECT 
      city,
      region,
      COUNT(DISTINCT id) as shop_count,
      COUNT(DISTINCT product_id) as product_count
    FROM shops
    WHERE city LIKE ? AND status = 'active'
    GROUP BY city, region
    ORDER BY shop_count DESC, city ASC
    LIMIT ?
  `;
  
  db.all(sql, [`%${q}%`, parseInt(limit)], (err, cities) => {
    if (err) {
      console.error('Error searching cities:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(cities);
  });
});

// Get city overview
app.get("/cities/:city/overview", (req, res) => {
  const city = req.params.city;
  
  const sql = `
    SELECT 
      COUNT(DISTINCT s.id) as total_shops,
      COUNT(DISTINCT p.id) as total_products,
      COUNT(DISTINCT CASE WHEN p.stock_quantity > 0 THEN p.id END) as available_products,
      COUNT(DISTINCT p.category) as categories,
      MIN(p.price) as lowest_price,
      MAX(p.price) as highest_price,
      AVG(p.price) as average_price,
      COUNT(DISTINCT CASE WHEN s.is_verified = 1 THEN s.id END) as verified_shops
    FROM shops s
    LEFT JOIN products p ON s.id = p.shop_id AND p.status = 'active'
    WHERE s.city = ? AND s.status = 'active'
  `;
  
  db.get(sql, [city], (err, overview) => {
    if (err) {
      console.error('Error fetching city overview:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(overview);
  });
});

// Popular products by city
app.get("/cities/:city/popular-products", (req, res) => {
  const city = req.params.city;
  const { limit = 10 } = req.query;
  
  const sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.is_verified as shop_verified,
      (p.view_count + p.wishlist_count) as popularity_score
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE s.city = ? AND p.status = 'active' AND s.status = 'active'
    ORDER BY popularity_score DESC, p.created_at DESC
    LIMIT ?
  `;
  
  db.all(sql, [city, parseInt(limit)], (err, products) => {
    if (err) {
      console.error('Error fetching popular products:', err);
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

// Categories by city
app.get("/cities/:city/categories", (req, res) => {
  const city = req.params.city;
  
  const sql = `
    SELECT 
      p.category,
      COUNT(DISTINCT p.id) as product_count,
      COUNT(DISTINCT p.shop_id) as shop_count,
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
