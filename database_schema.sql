-- Shop Management Tables
CREATE TABLE IF NOT EXISTS shops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  name_en TEXT NOT NULL,
  name_am TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  phone TEXT NOT NULL,
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
);

CREATE TABLE IF NOT EXISTS shop_verification (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop_id INTEGER NOT NULL,
  document_type TEXT NOT NULL,
  document_path TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  submitted_at TEXT,
  reviewed_at TEXT,
  review_notes TEXT,
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Enhanced Products Table
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
  specifications TEXT, -- JSON object for detailed specs
  images TEXT, -- JSON array of image paths
  tags TEXT, -- JSON array of tags
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
);

-- Product Specifications Table
CREATE TABLE IF NOT EXISTS product_specifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  spec_category TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Wishlist System
CREATE TABLE IF NOT EXISTS wishlist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  added_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(user_id, product_id)
);

-- Reviews System
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  shop_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT, -- JSON array of review images
  verified_purchase BOOLEAN DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published',
  created_at TEXT,
  updated_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Messaging System
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER NOT NULL,
  product_id INTEGER,
  shop_id INTEGER,
  subject TEXT,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'inquiry',
  status TEXT DEFAULT 'unread',
  reply_to INTEGER,
  created_at TEXT,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (shop_id) REFERENCES shops(id),
  FOREIGN KEY (reply_to) REFERENCES messages(id)
);

-- Stock Alerts
CREATE TABLE IF NOT EXISTS stock_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  alert_type TEXT DEFAULT 'available',
  is_active BOOLEAN DEFAULT 1,
  notified BOOLEAN DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Analytics Tables
CREATE TABLE IF NOT EXISTS product_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_id INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TEXT,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS shop_analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shop_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  product_views INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  products_sold INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0.0,
  FOREIGN KEY (shop_id) REFERENCES shops(id)
);
