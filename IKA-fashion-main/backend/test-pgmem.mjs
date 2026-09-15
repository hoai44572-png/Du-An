import pkg from 'pg-mem';
const { newDb, dataType } = pkg;
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

async function test() {
  const db = newDb();
  
  // Register missing PG functions in pg-mem
  db.public.registerFunction({
    name: 'gen_random_uuid',
    implementation: () => crypto.randomUUID(),
  });
  
  db.public.registerFunction({
    name: 'tstzrange',
    implementation: (a, b) => `${a} - ${b}`,
  });

  const sqlPath = path.join(process.cwd(), 'database', 'ika_database.sql');
  let sql = fs.readFileSync(sqlPath, 'utf8');

  // Strip CREATE EXTENSION and btree_gist / EXCLUDE constraints that pg-mem doesn't parse
  sql = sql.replace(/CREATE EXTENSION[^\n;]+;/gi, '-- extension stripped');
  sql = sql.replace(/CONSTRAINT\s+flash_sales_no_overlap\s+EXCLUDE[^\n;]+\)/gi, '');
  sql = sql.replace(/EXCLUDE USING gist[^\n;]+\)/gi, '');

  try {
    db.public.none(sql);
    console.log('SQL Preload Success!');
    const res = db.public.many('SELECT COUNT(*) FROM products');
    console.log('Products count:', res);
  } catch (err) {
    console.error('Preload Error:', err);
  }
}

test();
