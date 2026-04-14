const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./ethiopian_electronics.db');

db.all('PRAGMA table_info(users)', (err, columns) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Users table columns:');
    columns.forEach(col => console.log('- ' + col.name));
  }
  db.close();
});
