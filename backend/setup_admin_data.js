// Simple script to add sample data for admin dashboard testing

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const db = new sqlite3.Database(path.join(__dirname, 'ethiopian_electronics.db'));

// Add sample data step by step
async function addSampleData() {
  return new Promise((resolve, reject) => {
    console.log('Adding sample data for admin dashboard...');
    
    db.serialize(() => {
      // Step 1: Add sample cities
      const citiesSQL = `
        INSERT OR IGNORE INTO cities (id, name, name_am, region_id, latitude, longitude) VALUES
        (1, 'Dilla', 'ዲላ', 1, 6.4167, 38.3167),
        (2, 'Addis Ababa', 'አዲስ አበባ', 1, 9.1450, 38.7617),
        (3, 'Mekelle', 'መቀለ', 1, 13.4967, 39.4753)
      `;
      
      db.run(citiesSQL, (err) => {
        if (err) {
          console.error('Error adding cities:', err);
        } else {
          console.log('✅ Added sample cities');
          
          // Step 2: Add sample users
          const usersSQL = `
            INSERT OR IGNORE INTO users (id, username, email, password, role, phone) VALUES
            (1, 'dillashop', 'dilla@shop.com', 'hashed_password', 'seller', '+251911234567'),
            (2, 'addisshop', 'addis@shop.com', 'hashed_password', 'seller', '+251922345678'),
            (3, 'mekelleshop', 'mekelle@shop.com', 'hashed_password', 'seller', '+251933456789')
          `;
          
          db.run(usersSQL, (err) => {
            if (err) {
              console.error('Error adding users:', err);
            } else {
              console.log('✅ Added sample users');
              
              // Step 3: Add sample shops
              const shopsSQL = `
                INSERT OR IGNORE INTO shops (id, name, description, owner_id, city_id, address, phone, email, is_verified) VALUES
                (1, 'Ethiopian Electronics Hub', 'Your one-stop shop for all electronics in Dilla', 1, 1, 'Main Street, Dilla, Ethiopia', '+251911234567', 'dilla@electronics.com', 1),
                (2, 'Addis Tech Store', 'Modern electronics store in Addis Ababa', 2, 2, 'Bole Road, Addis Ababa, Ethiopia', '+251922345678', 'addis@electronics.com', 1),
                (3, 'Ethio Mobile Center', 'Specialized mobile phones and accessories', 3, 3, 'Mekelle, Ethiopia', '+251933456789', 'mekelle@electronics.com', 1)
              `;
              
              db.run(shopsSQL, (err) => {
                if (err) {
                  console.error('Error adding shops:', err);
                } else {
                  console.log('✅ Added sample shops');
                  
                  // Step 4: Add sample products
                  const productsSQL = `
                    INSERT OR IGNORE INTO products (
                      name, brand, model, category, subcategory, price, original_price, 
                      condition, description, ram, storage, battery, screen_size, screen_resolution,
                      processor, camera_front, camera_back, color, weight, dimensions,
                      stock_quantity, is_available, shop_id, created_at, updated_at
                    ) VALUES
                    ('Samsung Galaxy A14', 'Samsung', 'A14', 'phones', 'smartphones', 14500, 16000, 'new', 'Samsung Galaxy A14 with 4GB RAM and 64GB storage', '4GB', '64GB', '5000mAh', '6.6 inches', '1080x2408', 'MediaTek MT6769', '13MP', '50MP + 2MP', 'Black', '201g', '167.7 x 78.0 x 9.1 mm', 15, 1, 1, datetime('now'), datetime('now')),
                    ('iPhone 13', 'Apple', 'iPhone 13', 'phones', 'smartphones', 45000, 50000, 'new', 'Apple iPhone 13 with 4GB RAM and 128GB storage', '4GB', '128GB', '3240mAh', '6.1 inches', '1170x2532', 'A15 Bionic', '12MP', '12MP + 12MP', 'Pacific Blue', '174g', '146.7 x 71.5 x 7.65 mm', 8, 1, 1, datetime('now'), datetime('now')),
                    ('Tecno Spark 10', 'Tecno', 'Spark 10', 'phones', 'smartphones', 8500, 9500, 'new', 'Tecno Spark 10 with 4GB RAM and 128GB storage', '4GB', '128GB', '5000mAh', '6.6 inches', '720x1612', 'MediaTek Helio G85', '8MP', '50MP + 0.08MP', 'Blue', '194g', '164.5 x 75.8 x 8.9 mm', 25, 1, 2, datetime('now'), datetime('now')),
                    ('Dell Inspiron 15', 'Dell', 'Inspiron 15', 'laptops', 'notebooks', 35000, 40000, 'new', 'Dell Inspiron 15 with 8GB RAM and 512GB SSD', '8GB', '512GB SSD', '3-cell', '15.6 inches', '1920x1080', 'Intel Core i5-1135G7', 'HD Webcam', 'N/A', 'Silver', '1.83kg', '357.9 x 229.4 x 19.9 mm', 5, 1, 1, datetime('now'), datetime('now')),
                    ('HP Pavilion 14', 'HP', 'Pavilion 14', 'laptops', 'notebooks', 28000, 32000, 'new', 'HP Pavilion 14 with 8GB RAM and 256GB SSD', '8GB', '256GB SSD', '4-cell', '14 inches', '1366x768', 'AMD Ryzen 5 5625U', 'HD Webcam', 'N/A', 'Natural Silver', '1.41kg', '324.2 x 225.7 x 17.9 mm', 10, 1, 2, datetime('now'), datetime('now')),
                    ('AirPods Pro', 'Apple', 'AirPods Pro', 'accessories', 'audio', 12000, 15000, 'new', 'Apple AirPods Pro with active noise cancellation', 'N/A', 'N/A', '24+ hours with case', 'N/A', 'N/A', 'H1 chip', 'N/A', 'N/A', 'White', '5.4g each', '21.8 x 30.9 x 40.5 mm', 20, 1, 3, datetime('now'), datetime('now')),
                    ('Samsung Galaxy Watch 5', 'Samsung', 'Galaxy Watch 5', 'smart_watches', 'wearables', 18000, 22000, 'new', 'Samsung Galaxy Watch 5 with health tracking', '1.5GB', '16GB', '40 hours', '1.4 inches', '450x450', 'Exynos W920', 'N/A', 'N/A', 'Graphite', '29g', '44.4 x 43.3 x 10.8 mm', 12, 1, 1, datetime('now'), datetime('now')),
                    ('Canon EOS M50', 'Canon', 'EOS M50', 'cameras', 'digital', 25000, 30000, 'new', 'Canon EOS M50 mirrorless camera with 24.1MP sensor', 'N/A', 'SD card slot', '235 shots per charge', '3.0 inches', '1040k dots', 'DIGIC 8', 'N/A', '24.1MP', 'Black', '388g', '116.3 x 88.1 x 58.7 mm', 3, 1, 2, datetime('now'), datetime('now'))
                  `;
                  
                  db.run(productsSQL, (err) => {
                    if (err) {
                      console.error('Error adding products:', err);
                      reject(err);
                    } else {
                      console.log('✅ Added sample products');
                      
                      // Check final results
                      db.all("SELECT COUNT(*) as count FROM products", (err, products) => {
                        if (err) {
                          console.error('Error checking products:', err);
                          reject(err);
                        } else {
                          console.log(`\n🎉 Successfully added sample data!`);
                          console.log(`📱 Total products in database: ${products[0].count}`);
                          console.log('\n📊 Admin dashboard will show:');
                          console.log('• Samsung Galaxy A14 - ETB 14,500');
                          console.log('• iPhone 13 - ETB 45,000');
                          console.log('• Tecno Spark 10 - ETB 8,500');
                          console.log('• Dell Inspiron 15 - ETB 35,000');
                          console.log('• HP Pavilion 14 - ETB 28,000');
                          console.log('• AirPods Pro - ETB 12,000');
                          console.log('• Samsung Galaxy Watch 5 - ETB 18,000');
                          console.log('• Canon EOS M50 - ETB 25,000');
                          console.log('\n🔗 Admin dashboard should now show these products!');
                          resolve(products[0].count);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    });
  });
}

// Run the script
addSampleData()
  .then((productCount) => {
    console.log(`\n✅ Script completed successfully!`);
    console.log(`📱 Products ready for admin dashboard: ${productCount}`);
    db.close();
  })
  .catch((err) => {
    console.error('❌ Script failed:', err);
    db.close();
    process.exit(1);
  });
