import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function test() {
  const db = new PGlite();
  const sqlPath = path.join(process.cwd(), 'database', 'ika_database.sql');
  let sql = fs.readFileSync(sqlPath, 'utf8');

  sql = sql.replace(/CREATE EXTENSION[^\n;]+;/gi, '-- extension stripped');
  sql = sql.replace(/,\s*CONSTRAINT\s+flash_sales_no_overlap[\s\S]*?WHERE\s*\(active\)/gi, '');
  sql = sql.replace(/USING\s+gist/gi, '');

  try {
    await db.exec(sql);
    console.log('PGlite Preload SUCCESS!');
    const res = await db.query('SELECT COUNT(*) FROM products');
    console.log('Products count:', res.rows[0]);
  } catch (err) {
    console.error('PGlite Error details:', err.message);
  }
}

test();
