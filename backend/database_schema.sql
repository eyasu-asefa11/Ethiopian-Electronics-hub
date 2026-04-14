-- Enhanced Database Schema for Ethiopian Electronics Marketplace
-- Complete Ethiopian Electronics Marketplace

-- Drop existing tables if they exist
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS cities;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS users;

-- Regions (Ethiopian Administrative Regions)
CREATE TABLE regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    name_am TEXT UNIQUE,  -- Amharic name
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cities (Major Ethiopian Cities)
CREATE TABLE cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_am TEXT,  -- Amharic name
    region_id INTEGER,
    latitude REAL,
    longitude REAL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Users (Buyers and Sellers)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'buyer', -- 'buyer', 'seller', 'admin'
    profile_image TEXT,
    city_id INTEGER,
    address TEXT,
    is_verified BOOLEAN DEFAULT 0,
    verification_documents TEXT, -- JSON array of document file names
    preferred_language TEXT DEFAULT 'en', -- 'en', 'am'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Shops (Electronics Shops)
CREATE TABLE shops (
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
    verification_badge TEXT, -- 'verified', 'trusted', 'premium'
    rating REAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    business_license TEXT,
    operating_hours TEXT, -- JSON object
    social_links TEXT, -- JSON object
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Products (Electronics Devices)
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT, -- e.g., "A057F"
    category TEXT NOT NULL, -- 'Phones', 'Tablets', 'Laptops', 'Accessories'
    subcategory TEXT, -- 'Smartphone', 'Feature Phone', 'Gaming Laptop', etc.
    price REAL NOT NULL,
    original_price REAL, -- For showing discounts
    currency TEXT DEFAULT 'ETB',
    condition TEXT DEFAULT 'new', -- 'new', 'like_new', 'used', 'refurbished'
    description TEXT,
    
    -- Technical Specifications
    ram TEXT, -- "4GB", "8GB", "16GB"
    storage TEXT, -- "64GB", "128GB", "256GB", "512GB", "1TB"
    battery TEXT, -- "5000mAh", "4000mAh"
    screen_size TEXT, -- "6.5 inch", "15.6 inch"
    screen_resolution TEXT, -- "1080x2400", "1920x1080"
    processor TEXT, -- "Snapdragon 888", "Intel i7"
    camera_front TEXT, -- "16MP", "32MP"
    camera_back TEXT, -- "50MP", "64MP + 12MP + 5MP"
    color TEXT,
    weight TEXT,
    dimensions TEXT,
    
    -- Stock and Status
    stock_quantity INTEGER DEFAULT 1,
    min_stock_alert INTEGER DEFAULT 1,
    is_available BOOLEAN DEFAULT 1,
    is_featured BOOLEAN DEFAULT 0,
    
    -- Warranty and Additional Info
    warranty_period TEXT, -- "1 year", "6 months"
    warranty_terms TEXT,
    discount_percentage REAL,
    discount_valid_until DATE,
    tags TEXT, -- JSON array of tags
    seo_keywords TEXT,
    
    -- Shop and Timestamps
    shop_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Product Images (Multiple images per product)
CREATE TABLE product_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    image_type TEXT DEFAULT 'general', -- 'front', 'back', 'side', 'interface', 'accessories', 'general'
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Reviews and Ratings
CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    shop_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    pros TEXT, -- JSON array of pros
    cons TEXT, -- JSON array of cons
    is_verified_purchase BOOLEAN DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Wishlist (Saved Products)
CREATE TABLE wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(user_id, product_id)
);

-- Messages (Buyer-Seller Communication)
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    product_id INTEGER,
    shop_id INTEGER,
    subject TEXT,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'inquiry', -- 'inquiry', 'offer', 'negotiation', 'info'
    is_read BOOLEAN DEFAULT 0,
    is_archived BOOLEAN DEFAULT 0,
    parent_message_id INTEGER, -- For threading
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id),
    FOREIGN KEY (parent_message_id) REFERENCES messages(id)
);

-- Stock Alerts (Notify users when products are back in stock)
CREATE TABLE stock_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    is_notified BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
);

-- Analytics (Track product views, clicks, etc.)
CREATE TABLE analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER, -- Can be null for anonymous views
    shop_id INTEGER NOT NULL,
    event_type TEXT NOT NULL, -- 'view', 'click', 'inquiry', 'wishlist_add'
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (shop_id) REFERENCES shops(id)
);

-- Insert Ethiopian Regions
INSERT INTO regions (name, name_am) VALUES 
('Addis Ababa', 'አዲስ አበባ'),
('Afar', 'አፋር'),
('Amhara', 'አማራ'),
('Benishangul-Gumuz', 'ቤንሻንጉል-ጉሙዝ'),
('Dire Dawa', 'ድሬዳዋ'),
('Gambela', 'ጋምቤላ'),
('Harari', 'ሐረሪ'),
('Oromia', 'ኦሮሚያ'),
('Somali', 'ሱማሌ'),
('Southern Nations', 'ደቡብ ብሔሮች'),
('Tigray', 'ትግራይ');

-- Insert Major Ethiopian Cities
INSERT INTO cities (name, name_am, region_id, latitude, longitude) VALUES 
('Addis Ababa', 'አዲስ አበባ', 1, 9.1450, 40.4897),
('Hawassa', 'ሃዋሳ', 8, 7.0625, 38.4736),
('Bahir Dar', 'ባሕር ዳር', 3, 11.5937, 37.3897),
('Mekelle', 'መቀሌ', 11, 13.4967, 39.4753),
('Adama', 'አዳማ', 8, 8.5394, 39.2749),
('Dire Dawa', 'ድሬዳዋ', 5, 9.5944, 41.8661),
('Jimma', 'ጂማ', 8, 7.6667, 36.8333),
('Jijiga', 'ጅጅጋ', 10, 9.3500, 42.8000),
('Hossana', 'ሆሳዕና', 10, 7.5500, 37.8500),
('Shashamane', 'ሻሻማኔ', 8, 7.2167, 38.6000),
('Nekemte', 'ነቀምቴ', 8, 9.0833, 36.5500),
('Assosa', 'አሶሳ', 4, 10.0389, 34.7667),
('Gambela', 'ጋምቤላ', 6, 8.2500, 34.5833),
('Arba Minch', 'አርባ ምኒጭ', 10, 6.0333, 37.5500),
('Debre Birhan', 'ደብረብርሃን', 3, 9.6500, 39.5167);

-- Create indexes for better performance
CREATE INDEX idx_products_shop_id ON products(shop_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_model ON products(model);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_city ON products(shop_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX idx_analytics_product_id ON analytics(product_id);
CREATE INDEX idx_users_city ON users(city_id);
CREATE INDEX idx_shops_city ON shops(city_id);
