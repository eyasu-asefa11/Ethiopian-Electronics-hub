// Admin Authentication Endpoint
// Add this to your server.js file

// Admin Login Endpoint
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  // Check if it's admin credentials
  if (username === 'admin' && password === 'admin123') {
    // Get admin user from database
    const sql = "SELECT * FROM users WHERE username = ? AND role = 'admin'";
    
    db.get(sql, [username], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(401).json({ error: 'Admin not found' });
      }
      
      // Return admin data with token (simplified)
      res.json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token: 'admin-token-' + Date.now()
      });
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Admin Authentication Middleware
function authenticateAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Simple token validation (in production, use JWT)
  if (token.startsWith('admin-token-')) {
    req.user = { role: 'admin', username: 'admin' };
    next();
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Protected Admin Routes
app.get('/admin/dashboard-stats', authenticateAdmin, (req, res) => {
  const statsSQL = `
    SELECT 
      (SELECT COUNT(*) FROM users) as total_users,
      (SELECT COUNT(*) FROM shops) as total_shops,
      (SELECT COUNT(*) FROM products) as total_products,
      (SELECT COUNT(*) FROM users WHERE role = 'seller') as total_sellers,
      (SELECT COUNT(*) FROM users WHERE role = 'buyer') as total_buyers,
      (SELECT COUNT(*) FROM shops WHERE is_verified = 1) as verified_shops
  `;
  
  db.get(statsSQL, [], (err, stats) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({
      success: true,
      stats: stats
    });
  });
});

// Admin User Management
app.get('/admin/users', authenticateAdmin, (req, res) => {
  const sql = `
    SELECT u.id, u.username, u.email, u.role, u.phone, u.is_verified,
           s.name as shop_name, s.is_verified as shop_verified
    FROM users u
    LEFT JOIN shops s ON u.id = s.owner_id
    ORDER BY u.created_at DESC
  `;
  
  db.all(sql, [], (err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({
      success: true,
      users: users
    });
  });
});

// Admin Enable/Disable User
app.put('/admin/users/:id/toggle', authenticateAdmin, (req, res) => {
  const userId = req.params.id;
  const { action } = req.body; // 'enable' or 'disable'
  
  const sql = "UPDATE users SET is_verified = ? WHERE id = ?";
  const isVerified = action === 'enable' ? 1 : 0;
  
  db.run(sql, [isVerified, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({
      success: true,
      message: `User ${action}d successfully`
    });
  });
});

// Admin Shop Management
app.get('/admin/shops', authenticateAdmin, (req, res) => {
  const sql = `
    SELECT s.*, u.username as owner_name, u.email as owner_email,
           c.name as city_name
    FROM shops s
    LEFT JOIN users u ON s.owner_id = u.id
    LEFT JOIN cities c ON s.city_id = c.id
    ORDER BY s.created_at DESC
  `;
  
  db.all(sql, [], (err, shops) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({
      success: true,
      shops: shops
    });
  });
});

// Admin Enable/Disable Shop
app.put('/admin/shops/:id/toggle', authenticateAdmin, (req, res) => {
  const shopId = req.params.id;
  const { action } = req.body; // 'enable' or 'disable'
  
  const sql = "UPDATE shops SET is_verified = ? WHERE id = ?";
  const isVerified = action === 'enable' ? 1 : 0;
  
  db.run(sql, [isVerified, shopId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({
      success: true,
      message: `Shop ${action}d successfully`
    });
  });
});

// Admin Product Management
app.get('/admin/products', authenticateAdmin, (req, res) => {
  const sql = `
    SELECT p.*, s.name as shop_name, u.username as owner_name
    FROM products p
    LEFT JOIN shops s ON p.shop_id = s.id
    LEFT JOIN users u ON s.owner_id = u.id
    ORDER BY p.created_at DESC
  `;
  
  db.all(sql, [], (err, products) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({
      success: true,
      products: products
    });
  });
});

// Admin Enable/Disable Product
app.put('/admin/products/:id/toggle', authenticateAdmin, (req, res) => {
  const productId = req.params.id;
  const { action } = req.body; // 'enable' or 'disable'
  
  const sql = "UPDATE products SET is_available = ? WHERE id = ?";
  const isAvailable = action === 'enable' ? 1 : 0;
  
  db.run(sql, [isAvailable, productId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    res.json({
      success: true,
      message: `Product ${action}d successfully`
    });
  });
});

console.log('🔐 Admin authentication endpoints loaded');
