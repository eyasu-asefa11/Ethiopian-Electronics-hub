const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./dilla_electronics.db');

db.get('SELECT COUNT(*) as count FROM shops', (err, row) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Total shops in dilla_electronics.db:', row.count);
  }
  db.close();
});