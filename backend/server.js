const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;
const SECRET_KEY = "your_jwt_secret";

app.use(cors());
app.use(express.json());


// ================= DATABASE =================

const dbPath = path.join(__dirname, "ethiopian_electronics.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite database at", dbPath);
    
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      city TEXT,
      region TEXT,
      role TEXT DEFAULT 'buyer',
      shop_name_en TEXT,
      shop_name_am TEXT,
      created_at TEXT,
      updated_at TEXT
    )`, (err) => {
      if (err) {
        console.error("Error creating users table:", err.message);
      } else {
        console.log("Users table ready.");
        
        // Check and add missing columns
        db.all("PRAGMA table_info(users)", (err, columns) => {
          if (err) {
            console.error("Error checking table columns:", err.message);
            return;
          }
          
          const columnNames = columns.map(col => col.name);
          
          // Add missing columns if they don't exist
          if (!columnNames.includes('city')) {
            db.run("ALTER TABLE users ADD COLUMN city TEXT", (err) => {
              if (err) console.error("Error adding city column:", err.message);
              else console.log("Added city column");
            });
          }
          
          if (!columnNames.includes('region')) {
            db.run("ALTER TABLE users ADD COLUMN region TEXT", (err) => {
              if (err) console.error("Error adding region column:", err.message);
              else console.log("Added region column");
            });
          }
          
          if (!columnNames.includes('role')) {
            db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'buyer'", (err) => {
              if (err) console.error("Error adding role column:", err.message);
              else console.log("Added role column");
            });
          }
          
          if (!columnNames.includes('shop_name_en')) {
            db.run("ALTER TABLE users ADD COLUMN shop_name_en TEXT", (err) => {
              if (err) console.error("Error adding shop_name_en column:", err.message);
              else console.log("Added shop_name_en column");
            });
          }
          
          if (!columnNames.includes('shop_name_am')) {
            db.run("ALTER TABLE users ADD COLUMN shop_name_am TEXT", (err) => {
              if (err) console.error("Error adding shop_name_am column:", err.message);
              else console.log("Added shop_name_am column");
            });
          }
          
          if (!columnNames.includes('created_at')) {
            db.run("ALTER TABLE users ADD COLUMN created_at TEXT", (err) => {
              if (err) console.error("Error adding created_at column:", err.message);
              else console.log("Added created_at column");
            });
          }
          
          if (!columnNames.includes('updated_at')) {
            db.run("ALTER TABLE users ADD COLUMN updated_at TEXT", (err) => {
              if (err) console.error("Error adding updated_at column:", err.message);
              else console.log("Added updated_at column");
            });
          }
        });
      }
    });
  }
});


// ================= IMAGE UPLOAD CONFIG =================

const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));

  }

});

const upload = multer({ storage: storage });

// allow browser to access uploaded images
app.use("/uploads", express.static("uploads"));


// =====================================================
// USERS
// =====================================================

// Register
app.post("/register", async (req, res) => {

  const { username, phone_numbers, city, region, role, shop_name_en, shop_name_am } = req.body;

  if (!username || !phone_numbers || phone_numbers.length === 0) {
    return res.status(400).json({
      error: "username and at least one phone number required"
    });
  }

  if (role === 'seller' && (!shop_name_en || !shop_name_am)) {
    return res.status(400).json({
      error: "Shop name in both English and Amharic required for sellers"
    });
  }

  try {

    const hashedPassword = await bcrypt.hash('default123', 10); // Default password for phone auth

    const created_at = new Date().toISOString();
    const updated_at = created_at;

    // Store primary phone number in email field for compatibility
    const primaryPhone = phone_numbers[0];

    const sql = `
    INSERT INTO users
    (username,email,password,phone,city,region,role,shop_name_en,shop_name_am,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `;

    db.run(
      sql,
      [username, primaryPhone, hashedPassword, JSON.stringify(phone_numbers), city, region, role, shop_name_en, shop_name_am, created_at, updated_at],
      function (err) {

        if (err) {
          // Handle specific database errors
          if (err.message.includes('UNIQUE constraint failed: users.email')) {
            return res.status(400).json({ error: "This phone number is already registered. Please use a different phone number." });
          } else if (err.message.includes('UNIQUE constraint failed: users.username')) {
            return res.status(400).json({ error: "This username is already taken. Please choose a different username." });
          } else {
            return res.status(500).json({ error: err.message });
          }
        }

        res.json({
          message: "User registered successfully",
          user_id: this.lastID
        });

      }
    );

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

// Login
app.post("/login", (req, res) => {

  const { phone, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=?"; // Phone stored in email field

  db.get(sql, [phone], async (err, user) => {

    if (err) return res.status(500).json({ error: err.message });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password || 'default123', user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token: token
    });

  });

});


// =====================================================
// JWT AUTH
// =====================================================

function authenticateToken(req, res, next) {

  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Token missing"
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {

    if (err) {
      return res.status(403).json({
        error: "Invalid token"
      });
    }

    req.user = user;

    next();

  });

}


// =====================================================
// PRODUCTS
// =====================================================

// Get products
app.get("/products", (req, res) => {

  let sql = "SELECT * FROM products";

  const filters = [];
  const params = [];

  if (req.query.category) {
    filters.push("category=?");
    params.push(req.query.category);
  }

  if (req.query.status) {
    filters.push("status=?");
    params.push(req.query.status);
  }

  if (req.query.shop_id) {
    filters.push("shop_id=?");
    params.push(req.query.shop_id);
  }

  if (req.query.minPrice) {
    filters.push("price>=?");
    params.push(req.query.minPrice);
  }

  if (req.query.maxPrice) {
    filters.push("price<=?");
    params.push(req.query.maxPrice);
  }

  if (filters.length) {
    sql += " WHERE " + filters.join(" AND ");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const offset = (page - 1) * limit;

  sql += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);

  });

});

// Get cities with shop counts
app.get("/cities", (req, res) => {
  const sql = `
    SELECT c.*, r.name as region_name, COUNT(s.id) as shop_count
    FROM cities c
    LEFT JOIN regions r ON c.region_id = r.id
    LEFT JOIN shops s ON c.id = s.city_id AND s.is_verified = 1
    WHERE c.is_active = 1
    GROUP BY c.id
    ORDER BY c.name
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get all verified shops
app.get("/shops", (req, res) => {
  const sql = `
    SELECT s.*, u.username as owner_username, u.email as owner_email,
           c.name as city_name, r.name as region_name,
           COUNT(p.id) as product_count
    FROM shops s
    JOIN users u ON s.owner_id = u.id
    JOIN cities c ON s.city_id = c.id
    JOIN regions r ON c.region_id = r.id
    LEFT JOIN products p ON s.id = p.shop_id
    WHERE s.is_verified = 1
    GROUP BY s.id
    ORDER BY s.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Register a new shop
app.post("/shops/register", upload.array("images", 10), async (req, res) => {
  const { shop_name_en, shop_name_am, description, phone, telegram, city_id, address, owner_name, owner_phone } = req.body;

  if (!shop_name_en || !city_id || !owner_name || !owner_phone) {
    return res.status(400).json({ error: "Shop name (English), city, owner name, and owner phone are required" });
  }

  try {
    // Handle uploaded images
    let image_paths = [];
    if (req.files && req.files.length > 0) {
      image_paths = req.files.map(file => `/uploads/${file.filename}`);
    }

    const created_at = new Date().toISOString();
    const updated_at = created_at;

    // Use English name as Amharic fallback if not provided
    const final_shop_name_am = shop_name_am || shop_name_en;

    // First, create or get user
    const userSql = `
      INSERT OR IGNORE INTO users
      (username, email, password, phone, city, region, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 'seller', ?, ?)
    `;

    const hashedPassword = await bcrypt.hash('default123', 10);
    const username = owner_name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();

    db.run(
      userSql,
      [username, owner_phone, hashedPassword, owner_phone, 'Addis Ababa', 'Addis Ababa', created_at, updated_at],
      function(err) {
        if (err) {
          console.error('Error creating user:', err);
          return res.status(500).json({ error: 'Failed to create user account' });
        }

        const owner_id = this.lastID;

        // Now create the shop
        const shopSql = `
          INSERT INTO shops
          (owner_id, shop_name_en, shop_name_am, description, phone, telegram, city_id, address, image_paths, is_verified, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        `;

        db.run(
          shopSql,
          [owner_id, shop_name_en, final_shop_name_am, description, phone, telegram, city_id, address, JSON.stringify(image_paths), created_at, updated_at],
          function (shopErr) {
            if (shopErr) {
              console.error('Error registering shop:', shopErr);
              return res.status(500).json({ error: shopErr.message });
            }

            const shop_id = this.lastID;
            console.log('Shop registered successfully with ID:', shop_id);

            res.json({
              message: "Shop registered successfully",
              shop_id: shop_id,
              status: "active"
            });
          }
        );
      }
    );

  } catch (error) {
    console.error('Error in shop registration:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get search suggestions
app.get("/products/suggestions", (req, res) => {
  const query = req.query.q;
  if (!query || query.length < 2) {
    return res.json([]);
  }

  const sql = `
    SELECT p.id, p.name, p.brand, p.model, p.ram, p.storage, p.price,
           s.name as shop_name, c.name as city_name
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN cities c ON s.city_id = c.id
    WHERE p.is_available = 1 AND (
      p.name LIKE ? OR
      p.brand LIKE ? OR
      p.model LIKE ? OR
      p.ram LIKE ? OR
      p.storage LIKE ?
    )
    ORDER BY p.name
    LIMIT 10
  `;

  const searchTerm = `%${query}%`;
  db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Advanced product search
app.get("/products/search", (req, res) => {
  let sql = `
    SELECT p.*, s.name as shop_name, s.rating as shop_rating,
           c.name as city_name, c.name_am as city_name_am,
           GROUP_CONCAT(pi.image_url) as images
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN cities c ON s.city_id = c.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.is_available = 1
  `;

  const params = [];
  const conditions = [];

  // Search term
  if (req.query.q) {
    conditions.push(`(
      p.name LIKE ? OR
      p.brand LIKE ? OR
      p.model LIKE ? OR
      p.description LIKE ?
    )`);
    const searchTerm = `%${req.query.q}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  // City filter
  if (req.query.city) {
    conditions.push("c.id = ?");
    params.push(req.query.city);
  }

  // Category filter
  if (req.query.category) {
    conditions.push("p.category = ?");
    params.push(req.query.category);
  }

  // Brand filter
  if (req.query.brand) {
    conditions.push("p.brand = ?");
    params.push(req.query.brand);
  }

  // RAM filter
  if (req.query.ram) {
    conditions.push("p.ram = ?");
    params.push(req.query.ram);
  }

  // Storage filter
  if (req.query.storage) {
    conditions.push("p.storage = ?");
    params.push(req.query.storage);
  }

  // Condition filter
  if (req.query.condition) {
    conditions.push("p.condition = ?");
    params.push(req.query.condition);
  }

  // Price range
  if (req.query.minPrice) {
    conditions.push("p.price >= ?");
    params.push(req.query.minPrice);
  }

  if (req.query.maxPrice) {
    conditions.push("p.price <= ?");
    params.push(req.query.maxPrice);
  }

  if (conditions.length > 0) {
    sql += " AND " + conditions.join(" AND ");
  }

  sql += " GROUP BY p.id ";

  // Sorting
  const sortBy = req.query.sortBy || 'relevance';
  switch (sortBy) {
    case 'price_low':
      sql += " ORDER BY p.price ASC";
      break;
    case 'price_high':
      sql += " ORDER BY p.price DESC";
      break;
    case 'newest':
      sql += " ORDER BY p.created_at DESC";
      break;
    case 'rating':
      sql += " ORDER BY s.rating DESC";
      break;
    default:
      sql += " ORDER BY p.name ASC";
  }

  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  sql += " LIMIT ? OFFSET ?";
  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Parse images
    const products = rows.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : []
    }));
    
    res.json(products);
  });
});

// Get single product
app.get("/products/:id", (req, res) => {

  const sql = "SELECT * FROM products WHERE id=?";

  db.get(sql, [req.params.id], (err, row) => {

    if (err) return res.status(500).json({ error: err.message });

    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(row);

  });

});

// Get shop by product
app.get("/shops/:productId/shop", (req, res) => {
  const sql = `
    SELECT s.*, u.username as owner_username, u.email as owner_email,
           c.name as city_name, r.name as region_name
    FROM shops s
    JOIN users u ON s.owner_id = u.id
    JOIN cities c ON s.city_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE s.id = (SELECT shop_id FROM products WHERE id = ?)
  `;

  db.get(sql, [req.params.productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Shop not found" });
    res.json(row);
  });
});

// Get product reviews
app.get("/products/:id/reviews", (req, res) => {
  const sql = `
    SELECT r.*, u.username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = ?
    ORDER BY r.created_at DESC
  `;

  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Wishlist endpoints
app.get("/wishlist/check/:productId", authenticateToken, (req, res) => {
  const sql = "SELECT COUNT(*) as count FROM wishlist_items WHERE user_id = ? AND product_id = ?";
  
  db.get(sql, [req.user.id, req.params.productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ isWishlisted: row.count > 0 });
  });
});

app.post("/wishlist/:productId", authenticateToken, (req, res) => {
  const sql = `
    INSERT OR IGNORE INTO wishlist_items (user_id, product_id)
    VALUES (?, ?)
  `;

  db.run(sql, [req.user.id, req.params.productId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Added to wishlist", wishlistId: this.lastID });
  });
});

app.delete("/wishlist/:productId", authenticateToken, (req, res) => {
  const sql = "DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?";

  db.run(sql, [req.user.id, req.params.productId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Removed from wishlist" });
  });
});

// Messages
app.post("/messages", authenticateToken, (req, res) => {
  const { receiver_id, product_id, shop_id, message } = req.body;

  if (!receiver_id || !message) {
    return res.status(400).json({ error: "receiver_id and message required" });
  }

  const sql = `
    INSERT INTO messages (sender_id, receiver_id, product_id, shop_id, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [req.user.id, receiver_id, product_id, shop_id, message], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Message sent", messageId: this.lastID });
  });
});

// Analytics tracking
app.post("/analytics", (req, res) => {
  const { product_id, shop_id, event_type, user_id } = req.body;
  const ip_address = req.ip || req.connection.remoteAddress;
  const user_agent = req.get('User-Agent');

  const sql = `
    INSERT INTO analytics (product_id, user_id, shop_id, event_type, ip_address, user_agent)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [product_id, user_id, shop_id, event_type, ip_address, user_agent], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Analytics recorded" });
  });
});

// Get single product with enhanced details
app.get("/products/:id", (req, res) => {
  const sql = `
    SELECT p.*, s.name as shop_name, s.rating as shop_rating,
           c.name as city_name, c.name_am as city_name_am
    FROM products p
    JOIN shops s ON p.shop_id = s.id
    JOIN cities c ON s.city_id = c.id
    WHERE p.id = ?
  `;

  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Product not found" });

    // Get product images
    const imagesSql = "SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order";
    db.all(imagesSql, [req.params.id], (err, images) => {
      if (err) return res.status(500).json({ error: err.message });
      
      const product = {
        ...row,
        images: images.length > 0 ? images.map(img => img.image_url) : [row.image]
      };
      
      res.json(product);
    });
  });
});

// Create product WITH MULTIPLE IMAGES
app.post("/products", authenticateToken, upload.array("images", 5), (req, res) => {

  const { 
    name, brand, model, category, subcategory, price, original_price, condition,
    description, ram, storage, battery, screen_size, screen_resolution, processor,
    camera_front, camera_back, color, weight, dimensions, warranty_period,
    warranty_terms, discount_percentage, discount_valid_until, tags, seo_keywords,
    stock_quantity, min_stock_alert, shop_id 
  } = req.body;

  if (!name || !brand || !price || !shop_id) {
    return res.status(400).json({
      error: "Missing required fields: name, brand, price, shop_id"
    });
  }

  const created_at = new Date().toISOString();
  const updated_at = created_at;

  const sql = `
  INSERT INTO products
  (name, brand, model, category, subcategory, price, original_price, condition,
   description, ram, storage, battery, screen_size, screen_resolution, processor,
   camera_front, camera_back, color, weight, dimensions, warranty_period,
   warranty_terms, discount_percentage, discount_valid_until, tags, seo_keywords,
   stock_quantity, min_stock_alert, shop_id, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [
      name, brand, model, category, subcategory, price, original_price, condition,
      description, ram, storage, battery, screen_size, screen_resolution, processor,
      camera_front, camera_back, color, weight, dimensions, warranty_period,
      warranty_terms, discount_percentage, discount_valid_until, tags, seo_keywords,
      stock_quantity || 1, min_stock_alert || 1, shop_id, created_at, updated_at
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const productId = this.lastID;

      // Insert product images
      if (req.files && req.files.length > 0) {
        const imageSql = `
          INSERT INTO product_images (product_id, image_url, image_type, display_order)
          VALUES (?, ?, ?, ?)
        `;

        req.files.forEach((file, index) => {
          const imageType = index === 0 ? 'front' : 'general';
          db.run(imageSql, [productId, file.filename, imageType, index]);
        });
      }

      res.json({
        message: "Product created successfully",
        product_id: productId
      });
    }
  );

});

// Delete product
app.delete("/products/:id", authenticateToken, (req, res) => {
  const sql = "DELETE FROM products WHERE id=?";

  db.run(sql, [req.params.id], function (err) {

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    res.json({
      message: "Product deleted"
    });

  });

});


// =====================================================
// SERVER
// =====================================================

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});