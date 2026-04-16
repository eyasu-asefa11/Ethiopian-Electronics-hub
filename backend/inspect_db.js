const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ethiopian_electronics.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('DB open error:', err.message);
    process.exit(1);
  }
});

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
  if (err) {
    console.error('Table list error:', err.message);
    db.close();
    return;
  }
  console.log('tables:', tables.map(r => r.name));
  if (tables.some(t => t.name === 'shops')) {
    db.get('SELECT COUNT(*) AS count FROM shops', (err2, row) => {
      if (err2) {
        console.error('Count error:', err2.message);
      } else {
        console.log('shops count:', row.count);
      }
      db.close();
    });
  } else {
    db.close();
  }
});