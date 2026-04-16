const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, 'ethiopian_electronics.db'));

const schema = fs.readFileSync(path.join(__dirname, 'database_schema.sql'), 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Error executing schema:', err);
  } else {
    console.log('Database schema created successfully');
  }
  db.close();
});