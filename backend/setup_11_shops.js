const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ethiopian_electronics.db');

console.log('Setting up database with 11 shops...');

// Create tables
const createTablesSQL = `
-- Regions
CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    name_am TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_am TEXT,
    region_id INTEGER,
    latitude REAL,
    longitude REAL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'buyer',
    profile_image TEXT,
    city_id INTEGER,
    address TEXT,
    is_verified BOOLEAN DEFAULT 0,
    verification_documents TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Shops
CREATE TABLE IF NOT EXISTS shops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    owner_id INTEGER NOT NULL,
    city_id INTEGER NOT NULL,
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    logo TEXT,
    cover_image TEXT,
    latitude REAL,
    longitude REAL,
    is_verified BOOLEAN DEFAULT 0,
    verification_badge TEXT,
    rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    business_license TEXT,
    operating_hours TEXT,
    social_links TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    price REAL NOT NULL,
    original_price REAL,
    currency TEXT DEFAULT 'ETB',
    condition TEXT DEFAULT 'new',
    description TEXT,
    ram TEXT,
    storage TEXT,
    battery TEXT,
    screen_size TEXT,
    screen_resolution TEXT,
    processor TEXT,
    camera_front TEXT,
    camera_back TEXT,
    color TEXT,
    weight TEXT,
    dimensions TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT 1,
    shop_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);
`;

db.exec(createTablesSQL, (err) => {
  if (err) {
    console.error('Error creating tables:', err);
    return;
  }

  console.log('Tables created successfully');

  // Insert sample data
  const insertDataSQL = `
  -- Insert regions
  INSERT OR IGNORE INTO regions (id, name, name_am) VALUES
  (1, 'Oromia', 'ኦሮሚያ'),
  (2, 'Amhara', 'አማራ'),
  (3, 'Tigray', 'ትግራይ');

  -- Insert cities
  INSERT OR IGNORE INTO cities (id, name, name_am, region_id, latitude, longitude) VALUES
  (1, 'Dilla', 'ዲላ', 1, 6.4167, 38.3167),
  (2, 'Addis Ababa', 'አዲስ አበባ', 1, 9.1450, 38.7617),
  (3, 'Mekelle', 'መቀለ', 3, 13.4967, 39.4753),
  (4, 'Hawassa', 'ሀዋሳ', 1, 7.0500, 38.4667),
  (5, 'Bahir Dar', 'ባሕር ዳር', 2, 11.6000, 37.3833);

  -- Insert users
  INSERT OR IGNORE INTO users (id, username, email, password, role, phone) VALUES
  (1, 'dillashop', 'dilla@shop.com', 'hashed_password', 'seller', '+251911234567'),
  (2, 'addisshop', 'addis@shop.com', 'hashed_password', 'seller', '+251922345678'),
  (3, 'mekelleshop', 'mekelle@shop.com', 'hashed_password', 'seller', '+251933456789'),
  (4, 'hawassashop', 'hawassa@shop.com', 'hashed_password', 'seller', '+251944567890'),
  (5, 'bahirdarshop', 'bahirdar@shop.com', 'hashed_password', 'seller', '+251955678901'),
  (6, 'gondarshop', 'gondar@shop.com', 'hashed_password', 'seller', '+251966789012'),
  (7, 'jimmasShop', 'jimma@shop.com', 'hashed_password', 'seller', '+251977890123'),
  (8, 'dessieshop', 'dessie@shop.com', 'hashed_password', 'seller', '+251988901234'),
  (9, 'shashemeneShop', 'shashemene@shop.com', 'hashed_password', 'seller', '+251999012345'),
  (10, 'debreShop', 'debre@shop.com', 'hashed_password', 'seller', '+251900123456'),
  (11, 'adigratShop', 'adigrat@shop.com', 'hashed_password', 'seller', '+251911234567');

  -- Insert 11 shops
  INSERT OR IGNORE INTO shops (id, name, description, owner_id, city_id, address, phone, email, is_verified) VALUES
  (1, 'Ethiopian Electronics Hub', 'Your one-stop shop for all electronics in Dilla', 1, 1, 'Main Street, Dilla, Ethiopia', '+251911234567', 'dilla@electronics.com', 1),
  (2, 'Addis Tech Store', 'Modern electronics store in Addis Ababa', 2, 2, 'Bole Road, Addis Ababa, Ethiopia', '+251922345678', 'addis@electronics.com', 1),
  (3, 'Ethio Mobile Center', 'Specialized mobile phones and accessories', 3, 3, 'Mekelle, Ethiopia', '+251933456789', 'mekelle@electronics.com', 1),
  (4, 'Hawassa Electronics', 'Electronics store in Hawassa', 4, 4, 'Hawassa, Ethiopia', '+251944567890', 'hawassa@electronics.com', 1),
  (5, 'Bahir Dar Gadgets', 'Gadgets and electronics in Bahir Dar', 5, 5, 'Bahir Dar, Ethiopia', '+251955678901', 'bahirdar@electronics.com', 1),
  (6, 'Gondar Electronics', 'Electronics shop in Gondar', 6, 1, 'Gondar, Ethiopia', '+251966789012', 'gondar@electronics.com', 1),
  (7, 'Jimma Tech Hub', 'Technology hub in Jimma', 7, 2, 'Jimma, Ethiopia', '+251977890123', 'jimma@electronics.com', 1),
  (8, 'Dessie Electronics', 'Electronics store in Dessie', 8, 3, 'Dessie, Ethiopia', '+251988901234', 'dessie@electronics.com', 1),
  (9, 'Shashemene Gadgets', 'Gadgets in Shashemene', 9, 4, 'Shashemene, Ethiopia', '+251999012345', 'shashemene@electronics.com', 1),
  (10, 'Debre Markos Tech', 'Technology store in Debre Markos', 10, 5, 'Debre Markos, Ethiopia', '+251900123456', 'debre@electronics.com', 1),
  (11, 'Adigrat Electronics', 'Electronics store in Adigrat', 11, 3, 'Adigrat, Ethiopia', '+251911234567', 'adigrat@electronics.com', 1);

  -- Insert sample products
  INSERT OR IGNORE INTO products (name, brand, category, price, description, shop_id) VALUES
  ('Samsung Galaxy A14', 'Samsung', 'phones', 14500, 'Samsung Galaxy A14 smartphone', 1),
  ('iPhone 13', 'Apple', 'phones', 45000, 'Apple iPhone 13', 2),
  ('Dell Laptop', 'Dell', 'laptops', 35000, 'Dell Inspiron 15 laptop', 3),
  ('AirPods Pro', 'Apple', 'accessories', 12000, 'Apple AirPods Pro', 4),
  ('Samsung Watch', 'Samsung', 'wearables', 18000, 'Samsung Galaxy Watch 5', 5),
  ('Canon Camera', 'Canon', 'cameras', 25000, 'Canon EOS M50 camera', 6),
  ('HP Laptop', 'HP', 'laptops', 28000, 'HP Pavilion 14 laptop', 7),
  ('Tecno Phone', 'Tecno', 'phones', 8500, 'Tecno Spark 10', 8),
  ('Bluetooth Speaker', 'JBL', 'accessories', 3500, 'JBL GO 3 speaker', 9),
  ('Wireless Mouse', 'Logitech', 'accessories', 1200, 'Logitech wireless mouse', 10),
  ('USB Drive', 'SanDisk', 'accessories', 800, '32GB USB drive', 11);
  `;

  db.exec(insertDataSQL, (err) => {
    if (err) {
      console.error('Error inserting data:', err);
    } else {
      console.log('Sample data inserted successfully');

      // Check final count
      db.get('SELECT COUNT(*) as count FROM shops', (err, row) => {
        console.log(`✅ Database setup complete! Total shops: ${row.count}`);
        db.close();
      });
    }
  });
});