import sqlite3
import glob

for path in glob.glob('*.db'):
    try:
        con = sqlite3.connect(path)
        cur = con.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [r[0] for r in cur.fetchall()]
        shops_count = None
        if 'shops' in tables:
            cur.execute('SELECT COUNT(*) FROM shops')
            shops_count = cur.fetchone()[0]
        print(path, 'tables=', tables, 'shops=', shops_count)
        con.close()
    except Exception as e:
        print(path, 'ERROR', e)
