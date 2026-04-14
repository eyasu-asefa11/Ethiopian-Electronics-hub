// Enhanced Product Search with Specifications and Images
// Add these endpoints to your server.js

// Advanced Product Search with Specifications
app.get("/products/search", (req, res) => {
  const { q, city, category, brand, minPrice, maxPrice, ram, storage, limit = 20, offset = 0 } = req.query;
  
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
      u.username as owner_username
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.status = 'active' AND s.status = 'active'
  `;
  
  const params = [];
  
  if (q) {
    sql += " AND (p.name LIKE ? OR p.brand LIKE ? OR p.model LIKE ? OR p.description LIKE ?)";
    const searchTerm = `%${q}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
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
  
  if (ram) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.ram') = ?";
    params.push(ram);
  }
  
  if (storage) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.storage') = ?";
    params.push(storage);
  }
  
  sql += " ORDER BY p.is_featured DESC, p.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error searching products:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Parse JSON fields for each product
    const processedProducts = products.map(product => ({
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : []
    }));
    
    res.json(processedProducts);
  });
});

// Product Comparison API
app.get("/products/compare", (req, res) => {
  const { city, product_name, brand, model } = req.query;
  
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
    WHERE p.status = 'active' 
    AND s.status = 'active'
    AND s.city = ?
  `;
  
  const params = [city];
  
  if (product_name) {
    sql += " AND (p.name LIKE ? OR p.model LIKE ?)";
    params.push(`%${product_name}%`, `%${product_name}%`);
  }
  
  if (brand) {
    sql += " AND p.brand = ?";
    params.push(brand);
  }
  
  if (model) {
    sql += " AND p.model = ?";
    params.push(model);
  }
  
  sql += " ORDER BY p.price ASC";
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error fetching comparison data:', err);
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

// Get Product Details with All Information
app.get("/products/:id", (req, res) => {
  const productId = req.params.id;
  
  const sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.name_am as shop_name_am,
      s.city as shop_city,
      s.region as shop_region,
      s.address as shop_address,
      s.phone as shop_phone,
      s.whatsapp as shop_whatsapp,
      s.email as shop_email,
      s.is_verified as shop_verified,
      s.rating as shop_rating,
      s.review_count as shop_review_count,
      s.opening_hours as shop_hours,
      u.username as owner_username
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE p.id = ? AND p.status = 'active'
  `;
  
  db.get(sql, [productId], (err, product) => {
    if (err) {
      console.error('Error fetching product details:', err);
      return res.status(500).json({ error: err.message });
    }
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Parse JSON fields
    const processedProduct = {
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : []
    };
    
    res.json(processedProduct);
  });
});

// Get Shop Products with Inventory Management
app.get("/shops/:shopId/products", (req, res) => {
  const shopId = req.params.shopId;
  const { category, minPrice, maxPrice, inStock } = req.query;
  
  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.is_verified as shop_verified
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.shop_id = ? AND p.status = 'active'
  `;
  
  const params = [shopId];
  
  if (category) {
    sql += " AND p.category = ?";
    params.push(category);
  }
  
  if (minPrice) {
    sql += " AND p.price >= ?";
    params.push(parseFloat(minPrice));
  }
  
  if (maxPrice) {
    sql += " AND p.price <= ?";
    params.push(parseFloat(maxPrice));
  }
  
  if (inStock === 'true') {
    sql += " AND p.stock_quantity > 0";
  }
  
  sql += " ORDER BY p.is_featured DESC, p.created_at DESC";
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error fetching shop products:', err);
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

// Shop Inventory Management
app.post("/shops/:shopId/inventory", authenticateToken, (req, res) => {
  const shopId = req.params.shopId;
  const { productId, action, quantity } = req.body;
  
  // Verify user owns the shop
  const verifySql = "SELECT user_id FROM shops WHERE id = ?";
  db.get(verifySql, [shopId], (err, shop) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!shop || shop.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Update product inventory
    let updateSql = "";
    let updateParams = [];
    
    switch (action) {
      case 'add_stock':
        updateSql = "UPDATE products SET stock_quantity = stock_quantity + ?, updated_at = ? WHERE id = ? AND shop_id = ?";
        updateParams = [quantity, new Date().toISOString(), productId, shopId];
        break;
      case 'remove_stock':
        updateSql = "UPDATE products SET stock_quantity = stock_quantity - ?, updated_at = ? WHERE id = ? AND shop_id = ? AND stock_quantity >= ?";
        updateParams = [quantity, new Date().toISOString(), productId, shopId, quantity];
        break;
      case 'set_stock':
        updateSql = "UPDATE products SET stock_quantity = ?, updated_at = ? WHERE id = ? AND shop_id = ?";
        updateParams = [quantity, new Date().toISOString(), productId, shopId];
        break;
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
    
    db.run(updateSql, updateParams, function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (this.changes === 0) {
        return res.status(400).json({ error: 'Product not found or insufficient stock' });
      }
      
      res.json({ message: 'Inventory updated successfully' });
    });
  });
});

// Get Products by Category with Specifications
app.get("/products/category/:category", (req, res) => {
  const category = req.params.category;
  const { city, brand, minPrice, maxPrice, ram, storage, limit = 20 } = req.query;
  
  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.is_verified as shop_verified,
      s.rating as shop_rating
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.category = ? AND p.status = 'active'
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
  
  if (ram) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.ram') = ?";
    params.push(ram);
  }
  
  if (storage) {
    sql += " AND JSON_EXTRACT(p.specifications, '$.storage') = ?";
    params.push(storage);
  }
  
  sql += " ORDER BY p.is_featured DESC, p.price ASC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, products) => {
    if (err) {
      console.error('Error fetching category products:', err);
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

// Live Search Suggestions
app.get("/products/suggestions", (req, res) => {
  const { q, city, limit = 10 } = req.query;
  
  if (!q || q.length < 2) {
    return res.json([]);
  }
  
  let sql = `
    SELECT 
      p.id,
      p.name,
      p.brand,
      p.model,
      p.price,
      p.ram,
      p.storage,
      p.images,
      s.name_en as shop_name,
      s.city as shop_city,
      s.is_verified as shop_verified
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' 
    AND (p.name LIKE ? OR p.brand LIKE ? OR p.model LIKE ?)
  `;
  
  const params = [`%${q}%`, `%${q}%`, `%${q}%`];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " ORDER BY p.name ASC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, suggestions) => {
    if (err) {
      console.error('Error fetching suggestions:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Parse images field
    const processedSuggestions = suggestions.map(suggestion => ({
      ...suggestion,
      images: suggestion.images ? JSON.parse(suggestion.images) : []
    }));
    
    res.json(processedSuggestions);
  });
});

// Export Comparison Data
app.get("/products/export/comparison", (req, res) => {
  const { city, product_name, brand, model } = req.query;
  
  let sql = `
    SELECT 
      p.name as product_name,
      p.brand,
      p.model,
      p.price,
      p.original_price,
      p.stock_quantity,
      p.condition,
      p.color,
      p.ram,
      p.storage,
      p.battery,
      p.camera,
      p.screen_size,
      s.name_en as shop_name,
      s.city as shop_city,
      s.phone as shop_phone,
      s.whatsapp as shop_whatsapp,
      s.is_verified as shop_verified,
      s.rating as shop_rating,
      s.review_count as shop_review_count,
      s.address as shop_address
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.status = 'active' 
    AND s.status = 'active'
    AND s.city = ?
  `;
  
  const params = [city];
  
  if (product_name) {
    sql += " AND (p.name LIKE ? OR p.model LIKE ?)";
    params.push(`%${product_name}%`, `%${product_name}%`);
  }
  
  if (brand) {
    sql += " AND p.brand = ?";
    params.push(brand);
  }
  
  if (model) {
    sql += " AND p.model = ?";
    params.push(model);
  }
  
  sql += " ORDER BY p.price ASC";
  
  db.all(sql, params, (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Convert to CSV
    const csv = convertToCSV(products);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=comparison-${city}-${product_name || 'products'}.csv`);
    res.send(csv);
  });
});

function convertToCSV(data) {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');
  
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    }).join(',');
  });
  
  return csvHeaders + '\n' + csvRows.join('\n');
}
