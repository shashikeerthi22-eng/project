const bcrypt = require('bcrypt');
const db = require('./config/db');

async function updateAdmin() {
  const hash = await bcrypt.hash('admin123', 10);
  await db.execute('UPDATE users SET password = ? WHERE email = "admin@roadway.in"', [hash]);
  console.log('Admin password updated');
  process.exit();
}

updateAdmin();