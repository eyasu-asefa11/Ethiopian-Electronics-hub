// Smart Search and Filtering Backend Endpoints
// Add these to your server.js

// Advanced product search with multiple criteria
app.get("/products/smart-search", (req, res) => {
  const { 
    q,           // Search query (product name, model, etc.)
    brand,       // Brand filter
    model,       // Model filter
    ram,         // RAM filter
    storage,     // Storage filter
    product_type, // Product type/category
    city,        // City filter
    minPrice,    // Minimum price
    maxPrice,    // Maximum price
    condition,   // Condition filter
    limit = 20,  // Results limit
    offset = 0   // Results offset
  } = req.query;

  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.region as shop_region,
      s.phone as shop_phone,
      s.whatsapp as shop_whatsapp,
      s.is_verified as shop_verified,
      s.rating as shop_rating,
      s.review_count as shop_review_count,
      s.address as shop_address,
      u.username as owner_username,
      -- Add search relevance score
      CASE 
        WHEN p.name LIKE ? THEN 100
        WHEN p.model LIKE ? THEN 90
        WHEN p.brand LIKE ? THEN 80
        WHEN p.description LIKE ? THEN 70
        ELSE 50
      END as relevance_score
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [];
  
  // Add search query conditions
  if (q) {
    const searchTerm = `%${q}%`;
    sql += " AND (p.name LIKE ? OR p.model LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)";
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // Add specific filters
  if (brand) {
    sql += " AND p.brand = ?";
    params.push(brand);
  }
  
  if (model) {
    sql += " AND p.model = ?";
    params.push(model);
  }
  
  if (ram) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.ram') = ?";
    params.push(ram);
  }
  
  if (storage) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.storage') = ?";
    params.push(storage);
  }
  
  if (product_type) {
    sql += " AND p.category = ?";
    params.push(product_type);
  }
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  if (minPrice) {
    sql += " AND p.price >= ?";
    params.push(parseFloat(minPrice));
  }
  
  if (maxPrice) {
    sql += " AND p.price <= ?";
    params.push(parseFloat(maxPrice));
  }
  
  if (condition) {
    sql += " AND p.condition = ?";
    params.push(condition);
  }
  
  // Order by relevance score, then by featured status, then by price
  sql += " ORDER BY relevance_score DESC, p.is_featured DESC, p.price ASC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error in smart search:', err);
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

// Get search suggestions for autocomplete
app.get("/products/search-suggestions", (req, res) => {
  const { q, city, limit = 10 } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }
  
  let sql = `
    SELECT DISTINCT
      p.name as product_name,
      p.brand,
      p.model,
      p.category,
      p.price,
      s.city as shop_city,
      COUNT(*) as match_count
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
    AND (
      p.name LIKE ? OR 
      p.brand LIKE ? OR 
      p.model LIKE ? OR
      p.category LIKE ?
    )
  `;
  
  const params = [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " GROUP BY p.name, p.brand, p.model, p.category, p.price, s.city ORDER BY match_count DESC, p.name ASC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, suggestions) => {
    if (err) {
      console.error('Error fetching search suggestions:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(suggestions);
  });
});

// Get product comparison data for specific model across all shops
app.get("/products/compare-model/:model", (req, res) => {
  const { model } = req.params;
  const { city, ram, storage, limit = 20 } = req.query;
  
  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.region as shop_region,
      s.phone as shop_phone,
      s.whatsapp as shop_whatsapp,
      s.is_verified as shop_verified,
      s.rating as shop_rating,
      s.review_count as shop_review_count,
      s.address as shop_address,
      u.username as owner_username
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.model = ? AND p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [model];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  if (ram) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.ram') = ?";
    params.push(ram);
  }
  
  if (storage) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.storage') = ?";
    params.push(storage);
  }
  
  sql += " ORDER BY p.price ASC, s.rating DESC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error fetching model comparison:', err);
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

// Get popular search terms
app.get("/products/popular-searches", (req, res) => {
  const { city, limit = 10 } = req.query;
  
  let sql = `
    SELECT 
      p.brand,
      p.model,
      p.category,
      COUNT(*) as search_count,
      AVG(p.price) as avg_price,
      COUNT(DISTINCT s.city) as available_in_cities
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " GROUP BY p.brand, p.model, p.category ORDER BY search_count DESC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, popularSearches) => {
    if (err) {
      console.error('Error fetching popular searches:', err);
      return res.status(500).json({ error: err.message });
    }
    
    res.json(popularSearches);
  });
});

// Advanced filter options
app.get("/products/filter-options", (req, res) => {
  const { city } = req.query;
  
  const sql = `
    SELECT 
      'brands' as filter_type,
      p.brand as value,
      COUNT(*) as count
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
    ${city ? 'AND s.city = ?' : ''}
    GROUP BY p.brand
    
    UNION ALL
    
    SELECT 
      'models' as filter_type,
      p.model as value,
      COUNT(*) as count
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
    ${city ? 'AND s.city = ?' : ''}
    GROUP BY p.model
    
    UNION ALL
    
    SELECT 
      'ram_options' as filter_type,
      JSON_EXTRACT(p.specifications, '$.ram') as value,
      COUNT(*) as count
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
    AND JSON_EXTRACT(p.specifications, '$.ram') IS NOT NULL
    ${city ? 'AND s.city = ?' : ''}
    GROUP BY JSON_EXTRACT(p.specifications, '$.ram')
    
    UNION ALL
    
    SELECT 
      'storage_options' as filter_type,
      JSON_EXTRACT(p.specifications, '$.storage') as value,
      COUNT(*) as count
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
    AND JSON_EXTRACT(p.specifications, '$.storage') IS NOT NULL
    ${city ? 'AND s.city = ?' : ''}
    GROUP BY JSON_EXTRACT(p.specifications, '$.storage')
    
    UNION ALL
    
    SELECT 
      'conditions' as filter_type,
      p.condition as value,
      COUNT(*) as count
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' AND s.status = 'active'
    ${city ? 'AND s.city = ?' : ''}
    GROUP BY p.condition
  `;
  
  const params = city ? [city, city, city, city, city] : [];
  
  db.all(sql, params, (err, filterOptions) => {
    if (err) {
      console.error('Error fetching filter options:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Group by filter type
    const groupedOptions = {};
    filterOptions.forEach(option => {
      if (!groupedOptions[option.filter_type]) {
        groupedOptions[option.filter_type] = [];
      }
      groupedOptions[option.filter_type].push({
        value: option.value,
        count: option.count
      });
    });
    
    res.json(groupedOptions);
  });
});

// Search history for users (if implemented)
app.get("/products/search-history", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { limit = 10 } = req.query;
  
  // This would require a search_history table
  // For now, return empty array
  res.json([]);
});

// Save search history (if implemented)
app.post("/products/search-history", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { search_query, filters } = req.body;
  
  // This would require a search_history table
  // For now, just return success
  res.json({ message: 'Search history saved' });
});
