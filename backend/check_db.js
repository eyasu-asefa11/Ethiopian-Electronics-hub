const sqlite3 = require('sqlite3').verbose();
const path = require('path');

function checkDB(dbName) {
  return new Promise((resolve) => {
    const db = new sqlite3.Database(path.join(__dirname, dbName));
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      if (err) {
        console.log(`${dbName}: Error - ${err.message}`);
      } else {
        console.log(`${dbName}: ${tables.length} tables -`, tables.map(t => t.name).join(', '));
        
        // Also check shops count
        db.get('SELECT COUNT(*) as count FROM shops', (err2, row) => {
          if (!err2) {
            console.log(`${dbName}: ${row.count} shops`);
          }
          db.close();
          resolve();
        });
      }
    });
  });
}

async function checkAll() {
  await checkDB('ethiopian_electronics.db');
  await checkDB('dilla_electronics.db');
  await checkDB('database.db');
}

checkAll();