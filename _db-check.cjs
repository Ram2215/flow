const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const p = new Pool({ connectionString: 'postgresql://postgres:root@localhost:5432/flow' });

async function main() {
  // Check users table
  const users = await p.query('SELECT * FROM "users"');
  console.log('Users table:', JSON.stringify(users.rows, null, 2));

  const accounts = await p.query('SELECT * FROM "account"');
  console.log('Accounts table:', JSON.stringify(accounts.rows, null, 2));

  // Check sessions
  const sessions = await p.query('SELECT * FROM "session"');
  console.log('Sessions:', sessions.rows.length);

  if (accounts.rows.length > 0) {
    const match = await bcrypt.compare('admin1234', accounts.rows[0].password);
    console.log('Password match:', match);
  }

  await p.end();
}
main().catch(e => { console.error(e); p.end(); });
