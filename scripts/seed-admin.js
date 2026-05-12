const bcrypt = require('bcryptjs');

const password = 'admin';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log('Hashed password for "admin":');
console.log(hashedPassword);
console.log('\nAdd this to your database schema.sql or run this SQL:');
console.log(`INSERT INTO admin (username, password) VALUES ('Admin@swiftoralogistics.online', '${hashedPassword}');`);
