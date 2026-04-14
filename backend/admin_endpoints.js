// Enhanced Admin API Endpoints for Advanced Dashboard

// Admin Overview
app.get("/admin/overview", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      COUNT(DISTINCT u.id) as totalUsers,
      COUNT(DISTINCT CASE WHEN u.created_at >= date('now', '-1 month') THEN u.id END) as newUsersThisMonth,
      COUNT(DISTINCT s.id) as totalShops,
      COUNT(DISTINCT CASE WHEN s.created_at >= date('now', '-1 month') THEN s.id END) as newShopsThisMonth,
      COUNT(DISTINCT p.id) as totalProducts,
      COUNT(DISTINCT CASE WHEN p.created_at >= date('now', '-1 month') THEN p.id END) as newProductsThisMonth,
      COALESCE(SUM(CASE WHEN sa.date >= date('now', '-1 month') THEN sa.revenue END), 0) as totalRevenue
    FROM users u
    LEFT JOIN shops s ON u.id = s.user_id
    LEFT JOIN products p ON s.id = p.shop_id
    LEFT JOIN shop_analytics sa ON s.id = sa.shop_id
  `;

  db.get(sql, [], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Get Users with Shop Information
app.get("/admin/users", authenticateToken, (req, res) => {
  const { search, status, city, limit = 50, offset = 0 } = req.query;
  
  let sql = `
    SELECT 
      u.*,
      s.name_en as shop_name_en,
      s.name_am as shop_name_am,
      s.is_verified as shop_verified
    FROM users u
    LEFT JOIN shops s ON u.id = s.user_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (search) {
    sql += " AND (u.username LIKE ? OR u.email LIKE ? OR s.name_en LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (status) {
    sql += " AND u.status = ?";
    params.push(status);
  }
  
  if (city) {
    sql += " AND u.city = ?";
    params.push(city);
  }
  
  sql += " ORDER BY u.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(sql, params, (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(users);
  });
});

// Get Shops with Detailed Information
app.get("/admin/shops", authenticateToken, (req, res) => {
  const { search, status, limit = 50, offset = 0 } = req.query;
  
  let sql = `
    SELECT 
      s.*,
      u.username as owner_username,
      COUNT(DISTINCT p.id) as product_count,
      COALESCE(AVG(r.rating), 0) as rating,
      COUNT(DISTINCT r.id) as review_count,
      COALESCE(SUM(sa.product_views), 0) as view_count,
      COALESCE(SUM(sa.products_sold), 0) as products_sold,
      COALESCE(SUM(sa.revenue), 0) as total_revenue,
      COALESCE(SUM(sa.messages_received), 0) as messages_count
    FROM shops s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN products p ON s.id = p.shop_id
    LEFT JOIN reviews r ON s.id = r.shop_id
    LEFT JOIN shop_analytics sa ON s.id = sa.shop_id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (search) {
    sql += " AND (s.name_en LIKE ? OR s.name_am LIKE ? OR u.username LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (status) {
    sql += " AND s.is_verified = ?";
    params.push(status === 'verified' ? 1 : 0);
  }
  
  sql += " GROUP BY s.id ORDER BY s.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(sql, params, (err, shops) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(shops);
  });
});

// Get All Products with Shop Information
app.get("/admin/products", authenticateToken, (req, res) => {
  const { search, city, limit = 50, offset = 0 } = req.query;
  
  let sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.region as shop_region
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE 1=1
  `;
  
  const params = [];
  
  if (search) {
    sql += " AND (p.name LIKE ? OR p.brand LIKE ? OR p.model LIKE ?)";
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " ORDER BY p.created_at DESC LIMIT ? OFFSET ?";
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(sql, params, (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(products);
  });
});

// Get Analytics Data
app.get("/admin/analytics", authenticateToken, (req, res) => {
  const { dateRange = '30days' } = req.query;
  
  let dateCondition = '';
  switch (dateRange) {
    case '7days':
      dateCondition = "date >= date('now', '-7 days')";
      break;
    case '30days':
      dateCondition = "date >= date('now', '-30 days')";
      break;
    case '90days':
      dateCondition = "date >= date('now', '-90 days')";
      break;
    default:
      dateCondition = "date >= date('now', '-30 days')";
  }
  
  const sql = `
    SELECT 
      date,
      SUM(product_views) as daily_views,
      SUM(profile_views) as daily_profile_views,
      SUM(messages_received) as daily_messages,
      COUNT(DISTINCT shop_id) as active_shops
    FROM shop_analytics
    WHERE ${dateCondition}
    GROUP BY date
    ORDER BY date DESC
  `;
  
  db.all(sql, [], (err, analytics) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(analytics);
  });
});

// Get Recent Activity
app.get("/admin/recent-activity", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      'user' as type,
      username as description,
      '👤' as icon,
      created_at
    FROM users
    WHERE created_at >= date('now', '-7 days')
    
    UNION ALL
    
    SELECT 
      'shop' as type,
      name_en as description,
      '🏪' as icon,
      created_at
    FROM shops
    WHERE created_at >= date('now', '-7 days')
    
    UNION ALL
    
    SELECT 
      'product' as type,
      name as description,
      '📱' as icon,
      created_at
    FROM products
    WHERE created_at >= date('now', '-7 days')
    
    ORDER BY created_at DESC
    LIMIT 20
  `;
  
  db.all(sql, [], (err, activities) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(activities);
  });
});

// Verify Shop
app.post("/admin/shops/:id/verify", authenticateToken, (req, res) => {
  const { status } = req.body;
  const shopId = req.params.id;
  
  const sql = "UPDATE shops SET is_verified = ?, updated_at = ? WHERE id = ?";
  const updated_at = new Date().toISOString();
  
  db.run(sql, [status === 'verified' ? 1 : 0, updated_at, shopId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Log verification action
    const logSql = `
      INSERT INTO admin_logs (admin_id, action, target_type, target_id, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.run(logSql, [
      req.user.id,
      'verify_shop',
      'shop',
      shopId,
      `Shop ${status === 'verified' ? 'verified' : 'suspended'}`,
      updated_at
    ]);
    
    res.json({ message: `Shop ${status} successfully` });
  });
});

// Update User Status
app.post("/admin/users/:id/status", authenticateToken, (req, res) => {
  const { status } = req.body;
  const userId = req.params.id;
  
  const sql = "UPDATE users SET status = ?, updated_at = ? WHERE id = ?";
  const updated_at = new Date().toISOString();
  
  db.run(sql, [status, updated_at, userId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: `User status updated to ${status}` });
  });
});

// Export Data Functions
app.get("/admin/export/users", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      username, email, phone, city, region, role,
      shop_name_en, shop_name_am, created_at
    FROM users
    ORDER BY created_at DESC
  `;
  
  db.all(sql, [], (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Convert to CSV
    const csv = convertToCSV(users);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    res.send(csv);
  });
});

app.get("/admin/export/shops", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      name_en, name_am, address, city, region, phone, email,
      is_verified, rating, review_count, created_at
    FROM shops
    ORDER BY created_at DESC
  `;
  
  db.all(sql, [], (err, shops) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const csv = convertToCSV(shops);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=shops.csv');
    res.send(csv);
  });
});

app.get("/admin/export/products", authenticateToken, (req, res) => {
  const sql = `
    SELECT 
      name, brand, model, category, price, stock_quantity,
      condition, city, created_at
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    ORDER BY p.created_at DESC
  `;
  
  db.all(sql, [], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const csv = convertToCSV(products);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    res.send(csv);
  });
});

// Helper function to convert array to CSV
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
