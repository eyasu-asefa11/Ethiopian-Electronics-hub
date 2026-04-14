// Simple Backend Endpoints for Dashboard
// Add these to your server.js file

// Get all users with shop information
app.get("/admin/users", (req, res) => {
  const sql = `
    SELECT 
      u.id,
      u.username,
      u.email,
      u.phone,
      u.city,
      u.region,
      u.role,
      u.shop_name_en,
      u.shop_name_am,
      u.created_at,
      u.updated_at,
      s.name_en as shop_name,
      s.name_am as shop_name_amharic,
      s.is_verified as shop_verified
    FROM users u
    LEFT JOIN shops s ON u.id = s.user_id
    ORDER BY u.created_at DESC
  `;

  db.all(sql, [], (err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(users);
  });
});

// Get all shops with detailed information
app.get("/admin/shops", (req, res) => {
  const sql = `
    SELECT 
      s.*,
      u.username as owner_username,
      COUNT(DISTINCT p.id) as product_count,
      COALESCE(AVG(r.rating), 0) as rating,
      COUNT(DISTINCT r.id) as review_count
    FROM shops s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN products p ON s.id = p.shop_id
    LEFT JOIN reviews r ON s.id = r.shop_id
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;

  db.all(sql, [], (err, shops) => {
    if (err) {
      console.error('Error fetching shops:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(shops);
  });
});

// Get all products with shop information
app.get("/admin/products", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      s.name_en as shop_name,
      s.city as shop_city,
      s.region as shop_region,
      s.phone as shop_phone,
      u.username as owner_username
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN users u ON s.user_id = u.id
    ORDER BY p.created_at DESC
  `;

  db.all(sql, [], (err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(products);
  });
});

// Get dashboard overview statistics
app.get("/admin/overview", (req, res) => {
  const sql = `
    SELECT 
      COUNT(DISTINCT u.id) as totalUsers,
      COUNT(DISTINCT s.id) as totalShops,
      COUNT(DISTINCT p.id) as totalProducts,
      COUNT(DISTINCT CASE WHEN u.created_at >= date('now', '-7 days') THEN u.id END) as newUsersThisWeek,
      COUNT(DISTINCT CASE WHEN s.created_at >= date('now', '-7 days') THEN s.id END) as newShopsThisWeek,
      COUNT(DISTINCT CASE WHEN p.created_at >= date('now', '-7 days') THEN p.id END) as newProductsThisWeek
    FROM users u
    LEFT JOIN shops s ON u.id = s.user_id
    LEFT JOIN products p ON s.id = p.shop_id
  `;

  db.get(sql, [], (err, overview) => {
    if (err) {
      console.error('Error fetching overview:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(overview);
  });
});

// Create missing tables if they don't exist
app.post("/admin/setup-tables", (req, res) => {
  // Create shops table
  const createShopsTable = `
    CREATE TABLE IF NOT EXISTS shops (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name_en TEXT NOT NULL,
      name_am TEXT NOT NULL,
      description TEXT,
      address TEXT,
      city TEXT,
      region TEXT,
      phone TEXT,
      whatsapp TEXT,
      email TEXT,
      logo TEXT,
      cover_image TEXT,
      is_verified BOOLEAN DEFAULT 0,
      verification_documents TEXT,
      rating DECIMAL(3,2) DEFAULT 0.0,
      review_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;

  // Create products table
  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      brand TEXT,
      model TEXT,
      category TEXT NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      original_price DECIMAL(10,2),
      currency TEXT DEFAULT 'ETB',
      stock_quantity INTEGER DEFAULT 0,
      min_stock_alert INTEGER DEFAULT 5,
      condition TEXT DEFAULT 'new',
      color TEXT,
      specifications TEXT,
      images TEXT,
      tags TEXT,
      warranty_info TEXT,
      discount_info TEXT,
      is_featured BOOLEAN DEFAULT 0,
      is_available BOOLEAN DEFAULT 1,
      view_count INTEGER DEFAULT 0,
      wishlist_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    )
  `;

  // Create reviews table
  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      shop_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      title TEXT,
      comment TEXT,
      images TEXT,
      verified_purchase BOOLEAN DEFAULT 0,
      helpful_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'published',
      created_at TEXT,
      updated_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (shop_id) REFERENCES shops(id)
    )
  `;

  db.run(createShopsTable, (err) => {
    if (err) {
      console.error('Error creating shops table:', err);
      return res.status(500).json({ error: err.message });
    }

    db.run(createProductsTable, (err) => {
      if (err) {
        console.error('Error creating products table:', err);
        return res.status(500).json({ error: err.message });
      }

      db.run(createReviewsTable, (err) => {
        if (err) {
          console.error('Error creating reviews table:', err);
          return res.status(500).json({ error: err.message });
        }

        res.json({ message: 'Tables created successfully' });
      });
    });
  });
});

// Add sample data for testing
app.post("/admin/add-sample-data", (req, res) => {
  const sampleUser = {
    username: 'eyasu',
    email: '+251911234567',
    password: '$2a$10$example_hashed_password',
    city: 'Dilla',
    region: 'SNNPR',
    role: 'seller',
    shop_name_en: 'Eyasu Electronics',
    shop_name_am: 'እያሱ ኤሌክትሮኒክስ',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const sampleShop = {
    user_id: 1,
    name_en: 'Eyasu Electronics',
    name_am: 'እያሱ ኤሌክትሮኒክስ',
    description: 'Quality electronics at affordable prices',
    address: 'Main Street, Dilla Town',
    city: 'Dilla',
    region: 'SNNPR',
    phone: '+251911234567',
    whatsapp: '+251911234567',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const sampleProduct = {
    shop_id: 1,
    name: 'Samsung Galaxy A05',
    brand: 'Samsung',
    model: 'A057F',
    category: 'Phones',
    description: 'Brand new Samsung Galaxy A05 with excellent features',
    price: 14500,
    original_price: 16500,
    stock_quantity: 8,
    condition: 'new',
    color: 'Black',
    specifications: JSON.stringify({
      ram: '4GB',
      storage: '64GB',
      battery: '5000mAh',
      camera: '50MP',
      screen_size: '6.5 inch',
      processor: 'MediaTek Helio G35',
      operating_system: 'Android 13'
    }),
    images: JSON.stringify(['/placeholder-product.jpg']),
    warranty_info: '1 year manufacturer warranty',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Insert sample data
  db.run('INSERT INTO users (username, email, password, city, region, role, shop_name_en, shop_name_am, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [sampleUser.username, sampleUser.email, sampleUser.password, sampleUser.city, sampleUser.region, sampleUser.role, sampleUser.shop_name_en, sampleUser.shop_name_am, sampleUser.created_at, sampleUser.updated_at],
    function(err) {
      if (err) {
        console.error('Error inserting sample user:', err);
        return res.status(500).json({ error: err.message });
      }

      const userId = this.lastID;

      db.run('INSERT INTO shops (user_id, name_en, name_am, description, address, city, region, phone, whatsapp, is_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, sampleShop.name_en, sampleShop.name_am, sampleShop.description, sampleShop.address, sampleShop.city, sampleShop.region, sampleShop.phone, sampleShop.whatsapp, sampleShop.is_verified, sampleShop.created_at, sampleShop.updated_at],
        function(err) {
          if (err) {
            console.error('Error inserting sample shop:', err);
            return res.status(500).json({ error: err.message });
          }

          const shopId = this.lastID;

          db.run('INSERT INTO products (shop_id, name, brand, model, category, description, price, original_price, stock_quantity, condition, color, specifications, images, warranty_info, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [shopId, sampleProduct.name, sampleProduct.brand, sampleProduct.model, sampleProduct.category, sampleProduct.description, sampleProduct.price, sampleProduct.original_price, sampleProduct.stock_quantity, sampleProduct.condition, sampleProduct.color, sampleProduct.specifications, sampleProduct.images, sampleProduct.warranty_info, sampleProduct.created_at, sampleProduct.updated_at],
            function(err) {
              if (err) {
                console.error('Error inserting sample product:', err);
                return res.status(500).json({ error: err.message });
              }

              res.json({ message: 'Sample data added successfully' });
            });
        });
    });
});
