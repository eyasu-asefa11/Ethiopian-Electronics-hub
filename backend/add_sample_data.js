// Script to add sample shops and products for testing admin dashboard

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to database
const db = new sqlite3.Database(path.join(__dirname, 'ethiopian_electronics.db'));

// Sample shops data
const sampleShops = [
  {
    name: 'Ethiopian Electronics Hub',
    user_id: 1,
    description: 'Your one-stop shop for all electronics in Ethiopia',
    address: 'Main Street, Addis Ababa, Ethiopia',
    city: 'Addis Ababa',
    phone: '+251911234567',
    email: 'ethiopian@electronics.com',
    is_verified: 1,
    is_active: 1
  },
  {
    name: 'Addis Tech Store',
    user_id: 2,
    description: 'Modern electronics store in Addis Ababa',
    address: 'Bole Road, Addis Ababa, Ethiopia',
    city: 'Addis Ababa',
    phone: '+251922345678',
    email: 'addis@electronics.com',
    is_verified: 1,
    is_active: 1
  },
  {
    name: 'Ethio Mobile Center',
    user_id: 3,
    description: 'Specialized mobile phones and accessories',
    address: 'Mekelle, Ethiopia',
    city: 'Mekelle',
    phone: '+251933456789',
    email: 'mekelle@electronics.com',
    is_verified: 1,
    is_active: 1
  }
];

// Sample products data
const sampleProducts = [
  {
    name: 'Samsung Galaxy A14',
    brand: 'Samsung',
    model: 'A14',
    category: 'phones',
    subcategory: 'smartphones',
    price: 14500,
    original_price: 16000,
    condition: 'new',
    description: 'Samsung Galaxy A14 with 4GB RAM and 64GB storage',
    ram: '4GB',
    storage: '64GB',
    battery: '5000mAh',
    screen_size: '6.6 inches',
    screen_resolution: '1080x2408',
    processor: 'MediaTek MT6769',
    camera_front: '13MP',
    camera_back: '50MP + 2MP',
    color: 'Black',
    weight: '201g',
    dimensions: '167.7 x 78.0 x 9.1 mm',
    stock_quantity: 15,
    is_available: 1
  },
  {
    name: 'iPhone 13',
    brand: 'Apple',
    model: 'iPhone 13',
    category: 'phones',
    subcategory: 'smartphones',
    price: 45000,
    original_price: 50000,
    condition: 'new',
    description: 'Apple iPhone 13 with 4GB RAM and 128GB storage',
    ram: '4GB',
    storage: '128GB',
    battery: '3240mAh',
    screen_size: '6.1 inches',
    screen_resolution: '1170x2532',
    processor: 'A15 Bionic',
    camera_front: '12MP',
    camera_back: '12MP + 12MP',
    color: 'Pacific Blue',
    weight: '174g',
    dimensions: '146.7 x 71.5 x 7.65 mm',
    stock_quantity: 8,
    is_available: 1
  },
  {
    name: 'Tecno Spark 10',
    brand: 'Tecno',
    model: 'Spark 10',
    category: 'phones',
    subcategory: 'smartphones',
    price: 8500,
    original_price: 9500,
    condition: 'new',
    description: 'Tecno Spark 10 with 4GB RAM and 128GB storage',
    ram: '4GB',
    storage: '128GB',
    battery: '5000mAh',
    screen_size: '6.6 inches',
    screen_resolution: '720x1612',
    processor: 'MediaTek Helio G85',
    camera_front: '8MP',
    camera_back: '50MP + 0.08MP',
    color: 'Blue',
    weight: '194g',
    dimensions: '164.5 x 75.8 x 8.9 mm',
    stock_quantity: 25,
    is_available: 1
  },
  {
    name: 'Dell Inspiron 15',
    brand: 'Dell',
    model: 'Inspiron 15',
    category: 'laptops',
    subcategory: 'notebooks',
    price: 35000,
    original_price: 40000,
    condition: 'new',
    description: 'Dell Inspiron 15 with 8GB RAM and 512GB SSD',
    ram: '8GB',
    storage: '512GB SSD',
    battery: '3-cell',
    screen_size: '15.6 inches',
    screen_resolution: '1920x1080',
    processor: 'Intel Core i5-1135G7',
    camera_front: 'HD Webcam',
    camera_back: 'N/A',
    color: 'Silver',
    weight: '1.83kg',
    dimensions: '357.9 x 229.4 x 19.9 mm',
    stock_quantity: 5,
    is_available: 1
  },
  {
    name: 'HP Pavilion 14',
    brand: 'HP',
    model: 'Pavilion 14',
    category: 'laptops',
    subcategory: 'notebooks',
    price: 28000,
    original_price: 32000,
    condition: 'new',
    description: 'HP Pavilion 14 with 8GB RAM and 256GB SSD',
    ram: '8GB',
    storage: '256GB SSD',
    battery: '4-cell',
    screen_size: '14 inches',
    screen_resolution: '1366x768',
    processor: 'AMD Ryzen 5 5625U',
    camera_front: 'HD Webcam',
    camera_back: 'N/A',
    color: 'Natural Silver',
    weight: '1.41kg',
    dimensions: '324.2 x 225.7 x 17.9 mm',
    stock_quantity: 10,
    is_available: 1
  },
  {
    name: 'AirPods Pro',
    brand: 'Apple',
    model: 'AirPods Pro',
    category: 'accessories',
    subcategory: 'audio',
    price: 12000,
    original_price: 15000,
    condition: 'new',
    description: 'Apple AirPods Pro with active noise cancellation',
    ram: 'N/A',
    storage: 'N/A',
    battery: '24+ hours with case',
    screen_size: 'N/A',
    screen_resolution: 'N/A',
    processor: 'H1 chip',
    camera_front: 'N/A',
    camera_back: 'N/A',
    color: 'White',
    weight: '5.4g each',
    dimensions: '21.8 x 30.9 x 40.5 mm',
    stock_quantity: 20,
    is_available: 1
  },
  {
    name: 'Samsung Galaxy Watch 5',
    brand: 'Samsung',
    model: 'Galaxy Watch 5',
    category: 'smart_watches',
    subcategory: 'wearables',
    price: 18000,
    original_price: 22000,
    condition: 'new',
    description: 'Samsung Galaxy Watch 5 with health tracking',
    ram: '1.5GB',
    storage: '16GB',
    battery: '40 hours',
    screen_size: '1.4 inches',
    screen_resolution: '450x450',
    processor: 'Exynos W920',
    camera_front: 'N/A',
    camera_back: 'N/A',
    color: 'Graphite',
    weight: '29g',
    dimensions: '44.4 x 43.3 x 10.8 mm',
    stock_quantity: 12,
    is_available: 1
  },
  {
    name: 'Canon EOS M50',
    brand: 'Canon',
    model: 'EOS M50',
    category: 'cameras',
    subcategory: 'digital',
    price: 25000,
    original_price: 30000,
    condition: 'new',
    description: 'Canon EOS M50 mirrorless camera with 24.1MP sensor',
    ram: 'N/A',
    storage: 'SD card slot',
    battery: '235 shots per charge',
    screen_size: '3.0 inches',
    screen_resolution: '1040k dots',
    processor: 'DIGIC 8',
    camera_front: 'N/A',
    camera_back: '24.1MP',
    color: 'Black',
    weight: '388g',
    dimensions: '116.3 x 88.1 x 58.7 mm',
    stock_quantity: 3,
    is_available: 1
  }
];

// Function to add sample shops and products
async function addSampleData() {
  return new Promise((resolve, reject) => {
    console.log('Adding sample shops and products...');
    
    let addedShops = 0;
    let addedProducts = 0;
    const shopIds = [];
    
    db.serialize(() => {
      // Clear existing data first
      db.run("DELETE FROM products", (err) => {
        if (err) {
          console.error('Error clearing products:', err);
          reject(err);
          return;
        }
        
        db.run("DELETE FROM shops", (err) => {
          if (err) {
            console.error('Error clearing shops:', err);
            reject(err);
            return;
          }
          
          console.log('Cleared existing data');
          
          // Add sample shops
          const shopInsertSQL = `
            INSERT INTO shops (
              name, user_id, description, address, city, phone, email, 
              is_verified, is_active, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
          `;
          
          sampleShops.forEach((shop, index) => {
            const shopValues = [
              shop.name, shop.user_id, shop.description, shop.address,
              shop.city, shop.phone, shop.email, shop.is_verified, shop.is_active
            ];
            
            db.run(shopInsertSQL, shopValues, function(err) {
              if (err) {
                console.error(`Error adding shop ${shop.name}:`, err);
              } else {
                console.log(`✅ Added shop: ${shop.name}`);
                shopIds.push(this.lastID);
                addedShops++;
              }
              
              // When all shops are added, add products
              if (index === sampleShops.length - 1) {
                setTimeout(() => {
                  console.log(`\n🏪 Added ${addedShops} shops. Now adding products...`);
                  
                  // Add sample products
                  const productInsertSQL = `
                    INSERT INTO products (
                      name, brand, model, category, subcategory, price, original_price, 
                      condition, description, ram, storage, battery, screen_size, screen_resolution,
                      processor, camera_front, camera_back, color, weight, dimensions,
                      stock_quantity, is_available, shop_id, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
                  `;
                  
                  sampleProducts.forEach((product, pIndex) => {
                    // Assign shop_id (rotate through available shops)
                    const shopId = shopIds[pIndex % shopIds.length];
                    
                    const productValues = [
                      product.name, product.brand, product.model, product.category,
                      product.subcategory, product.price, product.original_price,
                      product.condition, product.description, product.ram,
                      product.storage, product.battery, product.screen_size, product.screen_resolution,
                      product.processor, product.camera_front, product.camera_back,
                      product.color, product.weight, product.dimensions,
                      product.stock_quantity, product.is_available, shopId
                    ];
                    
                    db.run(productInsertSQL, productValues, function(err) {
                      if (err) {
                        console.error(`Error adding product ${product.name}:`, err);
                      } else {
                        console.log(`✅ Added product: ${product.name} (Shop ID: ${shopId})`);
                        addedProducts++;
                      }
                      
                      // Check if all products have been processed
                      if (pIndex === sampleProducts.length - 1) {
                        setTimeout(() => {
                          console.log(`\n🎉 Successfully added ${addedShops} shops and ${addedProducts} products!`);
                          resolve({ shops: addedShops, products: addedProducts });
                        }, 100);
                      }
                    });
                  });
                }, 100);
              }
            });
          });
        });
      });
    });
  });
}

// Run the script
addSampleData()
  .then((result) => {
    console.log(`\n✅ Script completed!`);
    console.log(`🏪 Shops added: ${result.shops}`);
    console.log(`📱 Products added: ${result.products}`);
    console.log('\n📊 Sample data added:');
    console.log('• Ethiopian Electronics Hub');
    console.log('• Addis Tech Store');
    console.log('• Ethio Mobile Center');
    console.log('\n📱 Sample products:');
    console.log('• Samsung Galaxy A14 - ETB 14,500');
    console.log('• iPhone 13 - ETB 45,000');
    console.log('• Tecno Spark 10 - ETB 8,500');
    console.log('• Dell Inspiron 15 - ETB 35,000');
    console.log('• HP Pavilion 14 - ETB 28,000');
    console.log('• AirPods Pro - ETB 12,000');
    console.log('• Samsung Galaxy Watch 5 - ETB 18,000');
    console.log('• Canon EOS M50 - ETB 25,000');
    console.log('\n🔗 Admin dashboard should now show these products!');
    db.close();
  })
  .catch((err) => {
    console.error('❌ Script failed:', err);
    db.close();
    process.exit(1);
  });
