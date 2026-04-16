const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ethiopian_electronics.db');

const additionalShops = [
  {
    name: 'Hawassa Electronics',
    description: 'Electronics store in Hawassa',
    owner_id: 1,
    city_id: 1,
    address: 'Hawassa, Ethiopia',
    phone: '+251944567890',
    email: 'hawassa@electronics.com',
    is_verified: 1
  },
  {
    name: 'Dire Dawa Tech',
    description: 'Technology store in Dire Dawa',
    owner_id: 2,
    city_id: 2,
    address: 'Dire Dawa, Ethiopia',
    phone: '+251955678901',
    email: 'diredawa@electronics.com',
    is_verified: 1
  },
  {
    name: 'Bahir Dar Gadgets',
    description: 'Gadgets and electronics in Bahir Dar',
    owner_id: 3,
    city_id: 3,
    address: 'Bahir Dar, Ethiopia',
    phone: '+251966789012',
    email: 'bahirdar@electronics.com',
    is_verified: 1
  },
  {
    name: 'Gondar Electronics',
    description: 'Electronics shop in Gondar',
    owner_id: 1,
    city_id: 1,
    address: 'Gondar, Ethiopia',
    phone: '+251977890123',
    email: 'gondar@electronics.com',
    is_verified: 1
  },
  {
    name: 'Jimma Tech Hub',
    description: 'Technology hub in Jimma',
    owner_id: 2,
    city_id: 2,
    address: 'Jimma, Ethiopia',
    phone: '+251988901234',
    email: 'jimma@electronics.com',
    is_verified: 1
  },
  {
    name: 'Dessie Electronics',
    description: 'Electronics store in Dessie',
    owner_id: 3,
    city_id: 3,
    address: 'Dessie, Ethiopia',
    phone: '+251999012345',
    email: 'dessie@electronics.com',
    is_verified: 1
  },
  {
    name: 'Shashemene Gadgets',
    description: 'Gadgets in Shashemene',
    owner_id: 1,
    city_id: 1,
    address: 'Shashemene, Ethiopia',
    phone: '+251900123456',
    email: 'shashemene@electronics.com',
    is_verified: 1
  },
  {
    name: 'Debre Markos Tech',
    description: 'Technology store in Debre Markos',
    owner_id: 2,
    city_id: 2,
    address: 'Debre Markos, Ethiopia',
    phone: '+251911234567',
    email: 'debre@electronics.com',
    is_verified: 1
  }
];

let added = 0;
additionalShops.forEach((shop, index) => {
  db.run(`INSERT INTO shops (name, description, owner_id, city_id, address, phone, email, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [shop.name, shop.description, shop.owner_id, shop.city_id, shop.address, shop.phone, shop.email, shop.is_verified],
    function(err) {
      if (err) {
        console.error('Error adding shop:', shop.name, err);
      } else {
        added++;
        console.log(`Added shop: ${shop.name}`);
      }
      
      if (index === additionalShops.length - 1) {
        console.log(`\n✅ Added ${added} additional shops.`);
        db.get('SELECT COUNT(*) as count FROM shops', (err, row) => {
          console.log(`Total shops now: ${row.count}`);
          db.close();
        });
      }
    });
});