const { Pool } = require('pg');
const p = new Pool({ connectionString: 'postgresql://postgres:root@localhost:5432/flow' });

async function main() {
  await p.query(`INSERT INTO customers (id, name, email, country) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`, ['1', 'John Doe', 'john@example.com', 'USA']);
  const r = await p.query('SELECT * FROM customers');
  console.log(JSON.stringify(r.rows, null, 2));
  await p.end();
}
main().catch(e => { console.error(e); p.end(); });
