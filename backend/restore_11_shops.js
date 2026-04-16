const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'ethiopian_electronics.db');
const db = new sqlite3.Database(dbPath);

const usersSQL = `
INSERT OR IGNORE INTO users (id, username, email, password, role, phone, city, region, address, is_verified) VALUES
  (5, 'hawassashop', 'hawassa@shop.com', 'hashed_password', 'seller', '+251944567890', 'Hawassa', 'Oromia', 'Hawassa, Ethiopia', 1),
  (6, 'bahirdarshop', 'bahirdar@shop.com', 'hashed_password', 'seller', '+251955678901', 'Bahir Dar', 'Amhara', 'Bahir Dar, Ethiopia', 1),
  (7, 'gondarshop', 'gondar@shop.com', 'hashed_password', 'seller', '+251966789012', 'Gondar', 'Amhara', 'Gondar, Ethiopia', 1),
  (8, 'jimmasShop', 'jimma@shop.com', 'hashed_password', 'seller', '+251977890123', 'Jimma', 'Oromia', 'Jimma, Ethiopia', 1),
  (9, 'dessieshop', 'dessie@shop.com', 'hashed_password', 'seller', '+251988901234', 'Dessie', 'Amhara', 'Dessie, Ethiopia', 1),
  (10, 'shashemeneShop', 'shashemene@shop.com', 'hashed_password', 'seller', '+251999012345', 'Shashamane', 'Oromia', 'Shashamene, Ethiopia', 1),
  (11, 'debreShop', 'debre@shop.com', 'hashed_password', 'seller', '+251900123456', 'Debre Markos', 'Amhara', 'Debre Markos, Ethiopia', 1),
  (12, 'adigratShop', 'adigrat@shop.com', 'hashed_password', 'seller', '+251911234567', 'Adigrat', 'Tigray', 'Adigrat, Ethiopia', 1)
`;

const shopsSQL = `
INSERT OR IGNORE INTO shops (id, name, description, owner_id, city_id, address, phone, email, is_verified) VALUES
  (4, 'Hawassa Electronics', 'Electronics store in Hawassa', 5, 2, 'Hawassa, Ethiopia', '+251944567890', 'hawassa@electronics.com', 1),
  (5, 'Bahir Dar Gadgets', 'Gadgets and electronics in Bahir Dar', 6, 3, 'Bahir Dar, Ethiopia', '+251955678901', 'bahirdar@electronics.com', 1),
  (6, 'Gondar Electronics', 'Electronics shop in Gondar', 7, 1, 'Gondar, Ethiopia', '+251966789012', 'gondar@electronics.com', 1),
  (7, 'Jimma Tech Hub', 'Technology hub in Jimma', 8, 7, 'Jimma, Ethiopia', '+251977890123', 'jimma@electronics.com', 1),
  (8, 'Dessie Electronics', 'Electronics store in Dessie', 9, 1, 'Dessie, Ethiopia', '+251988901234', 'dessie@electronics.com', 1),
  (9, 'Shashemene Gadgets', 'Gadgets in Shashemene', 10, 10, 'Shashemene, Ethiopia', '+251999012345', 'shashemene@electronics.com', 1),
  (10, 'Debre Markos Tech', 'Technology store in Debre Markos', 11, 15, 'Debre Markos, Ethiopia', '+251900123456', 'debre@electronics.com', 1),
  (11, 'Adigrat Electronics', 'Electronics store in Adigrat', 12, 4, 'Adigrat, Ethiopia', '+251911234567', 'adigrat@electronics.com', 1)
`;

const insertData = () => {
  db.serialize(() => {
    db.run(usersSQL, (err) => {
      if (err) console.error('Error inserting users:', err);
      else console.log('Inserted or ignored additional users');
    });

    db.run(shopsSQL, (err) => {
      if (err) console.error('Error inserting shops:', err);
      else console.log('Inserted or ignored additional shops');
    });

    db.get('SELECT COUNT(*) AS count FROM shops', (err, row) => {
      if (err) {
        console.error('Count error:', err);
      } else {
        console.log('Total shops now:', row.count);
      }
      db.close();
    });
  });
};

insertData();