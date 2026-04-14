// Backend Endpoints for Additional Features
// Add these to your server.js

// Stock Alerts System
app.post("/stock-alerts", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { product_id, alert_type, target_price, email_notification, sms_notification } = req.body;
  
  const sql = `
    INSERT INTO stock_alerts (
      user_id, product_id, alert_type, target_price, 
      email_notification, sms_notification, is_active, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?)
  `;
  
  db.run(sql, [
    userId, product_id, alert_type, target_price, 
    email_notification, sms_notification, new Date().toISOString()
  ], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ message: 'Stock alert created successfully', alertId: this.lastID });
  });
});

app.get("/stock-alerts", authenticateToken, (req, res) => {
  const userId = req.user.id;
  
  const sql = `
    SELECT 
      sa.*,
      p.name as product_name,
      p.brand,
      p.model,
      p.price as current_price,
      p.stock_quantity,
      s.name_en as shop_name,
      s.city as shop_city
    FROM stock_alerts sa
    JOIN products p ON sa.product_id = p.id
    JOIN shops s ON p.shop_id = s.id
    WHERE sa.user_id = ? AND sa.is_active = 1
    ORDER BY sa.created_at DESC
  `;
  
  db.all(sql, [userId], (err, alerts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(alerts);
  });
});

app.delete("/stock-alerts/:id", authenticateToken, (req, res) => {
  const alertId = req.params.id;
  const userId = req.user.id;
  
  const sql = "DELETE FROM stock_alerts WHERE id = ? AND user_id = ?";
  db.run(sql, [alertId, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    
    res.json({ message: 'Stock alert deleted successfully' });
  });
});

// Seller Analytics
app.get("/shops/:shopId/analytics", authenticateToken, (req, res) => {
  const shopId = req.params.shopId;
  const { dateRange = '30days' } = req.query;
  
  // Verify user owns the shop
  const verifySql = "SELECT user_id FROM shops WHERE id = ?";
  db.get(verifySql, [shopId], (err, shop) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!shop || shop.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Analytics queries
    const overviewSql = `
      SELECT 
        COUNT(DISTINCT pv.id) as totalViews,
        COUNT(DISTINCT m.id) as totalMessages,
        COUNT(DISTINCT CASE WHEN p.stock_quantity < p.original_stock THEN p.id END) as totalSales,
        COALESCE(SUM(CASE WHEN p.stock_quantity < p.original_stock THEN p.price END), 0) as totalRevenue
      FROM shops s
      LEFT JOIN products p ON s.id = p.shop_id
      LEFT JOIN product_views pv ON p.id = pv.product_id
      LEFT JOIN messages m ON s.id = m.shop_id
      WHERE s.id = ?
    `;
    
    const topProductsSql = `
      SELECT 
        p.*,
        COUNT(DISTINCT pv.id) as views,
        COUNT(DISTINCT m.id) as inquiries,
        COUNT(DISTINCT CASE WHEN p.stock_quantity < p.original_stock THEN p.id END) as sold
      FROM products p
      LEFT JOIN product_views pv ON p.id = pv.product_id
      LEFT JOIN messages m ON p.id = m.product_id
      WHERE p.shop_id = ?
      GROUP BY p.id
      ORDER BY views DESC, inquiries DESC
      LIMIT 10
    `;
    
    const viewsDataSql = `
      SELECT 
        DATE(pv.viewed_at) as date,
        COUNT(*) as views
      FROM product_views pv
      JOIN products p ON pv.product_id = p.id
      WHERE p.shop_id = ?
      GROUP BY DATE(pv.viewed_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    const messagesDataSql = `
      SELECT 
        DATE(m.created_at) as date,
        COUNT(*) as messages
      FROM messages m
      WHERE m.shop_id = ?
      GROUP BY DATE(m.created_at)
      ORDER BY date DESC
      LIMIT 30
    `;
    
    Promise.all([
      new Promise((resolve, reject) => db.get(overviewSql, [shopId], (err, result) => err ? reject(err) : resolve(result))),
      new Promise((resolve, reject) => db.all(topProductsSql, [shopId], (err, results) => err ? reject(err) : resolve(results))),
      new Promise((resolve, reject) => db.all(viewsDataSql, [shopId], (err, results) => err ? reject(err) : resolve(results))),
      new Promise((resolve, reject) => db.all(messagesDataSql, [shopId], (err, results) => err ? reject(err) : resolve(results)))
    ]).then(([overview, topProducts, viewsData, messagesData]) => {
      res.json({
        overview,
        topProducts,
        viewsData,
        messagesData
      });
    }).catch(error => {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: error.message });
    });
  });
});

// Featured Products Management
app.put("/products/:id/featured", authenticateToken, (req, res) => {
  const productId = req.params.id;
  const { is_featured } = req.body;
  const userId = req.user.id;
  
  // Verify user owns the product
  const verifySql = `
    SELECT p.id 
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    WHERE p.id = ? AND s.user_id = ?
  `;
  
  db.get(verifySql, [productId, userId], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!product) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const updateSql = "UPDATE products SET is_featured = ?, updated_at = ? WHERE id = ?";
    db.run(updateSql, [is_featured, new Date().toISOString(), productId], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ message: 'Product featured status updated successfully' });
    });
  });
});

// Map View Data
app.get("/shops/map-data", (req, res) => {
  const { city, category, limit = 100 } = req.query;
  
  let sql = `
    SELECT 
      s.*,
      u.username as owner_username,
      COUNT(DISTINCT p.id) as product_count,
      AVG(r.rating) as rating,
      COUNT(DISTINCT r.id) as review_count
    FROM shops s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN products p ON s.id = p.shop_id AND p.status = 'active'
    LEFT JOIN reviews r ON s.id = r.shop_id
    WHERE s.status = 'active'
  `;
  
  const params = [];
  
  if (city) {
    sql += " AND s.city = ?";
    params.push(city);
  }
  
  sql += " GROUP BY s.id ORDER BY s.is_verified DESC, rating DESC LIMIT ?";
  params.push(parseInt(limit));
  
  db.all(sql, params, (err, shops) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json(shops);
  });
});

// Create additional tables
app.post("/setup-additional-tables", (req, res) => {
  const createStockAlertsTable = `
    CREATE TABLE IF NOT EXISTS stock_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      alert_type TEXT DEFAULT 'available',
      target_price DECIMAL(10,2),
      email_notification BOOLEAN DEFAULT 1,
      sms_notification BOOLEAN DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      triggered BOOLEAN DEFAULT 0,
      created_at TEXT,
      triggered_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `;
  
  const createProductViewsTable = `
    CREATE TABLE IF NOT EXISTS product_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER,
      ip_address TEXT,
      user_agent TEXT,
      viewed_at TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
  
  const createFeaturedProductsTable = `
    CREATE TABLE IF NOT EXISTS featured_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      shop_id INTEGER NOT NULL,
      featured_at TEXT,
      expires_at TEXT,
      is_active BOOLEAN DEFAULT 1,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    )
  `;
  
  db.run(createStockAlertsTable, (err) => {
    if (err) {
      console.error('Error creating stock_alerts table:', err);
      return res.status(500).json({ error: err.message });
    }
    
    db.run(createProductViewsTable, (err) => {
      if (err) {
        console.error('Error creating product_views table:', err);
        return res.status(500).json({ error: err.message });
      }
      
      db.run(createFeaturedProductsTable, (err) => {
        if (err) {
          console.error('Error creating featured_products table:', err);
          return res.status(500).json({ error: err.message });
        }
        
        res.json({ message: 'Additional tables created successfully' });
      });
    });
  });
});

// Stock alert notification trigger (would be called by a cron job)
app.post("/check-stock-alerts", (req, res) => {
  const sql = `
    SELECT 
      sa.*,
      p.name as product_name,
      p.stock_quantity,
      p.price as current_price,
      s.name_en as shop_name,
      u.email as user_email
    FROM stock_alerts sa
    JOIN products p ON sa.product_id = p.id
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON sa.user_id = u.id
    WHERE sa.is_active = 1 AND sa.triggered = 0
  `;
  
  db.all(sql, [], (err, alerts) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const triggeredAlerts = [];
    
    alerts.forEach(alert => {
      let shouldTrigger = false;
      let message = '';
      
      if (alert.alert_type === 'available' && alert.stock_quantity > 0) {
        shouldTrigger = true;
        message = `Good news! ${alert.product_name} is now available at ${alert.shop_name}`;
      }
      
      if (alert.alert_type === 'price_drop' && alert.current_price <= alert.target_price) {
        shouldTrigger = true;
        message = `Price drop alert! ${alert.product_name} is now ETB ${alert.current_price}`;
      }
      
      if (shouldTrigger) {
        // Mark as triggered
        db.run("UPDATE stock_alerts SET triggered = 1, triggered_at = ? WHERE id = ?", 
          [new Date().toISOString(), alert.id]);
        
        // Send notification (email/SMS - implementation needed)
        console.log(`Notification sent to ${alert.user_email}: ${message}`);
        
        triggeredAlerts.push({
          alertId: alert.id,
          message: message,
          userEmail: alert.user_email
        });
      }
    });
    
    res.json({ 
      message: 'Stock alerts checked',
      triggeredAlerts: triggeredAlerts.length
    });
  });
});
