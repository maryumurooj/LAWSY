import fs from 'fs';
import mysql from 'mysql2/promise';

// MySQL Connection Configuration
const pool = mysql.createPool({
  host: 'localhost',  // Replace with your MySQL host
  user: 'root',       // Replace with your MySQL username
  password: 'Areesha1$',       // Replace with your MySQL password
  database: 'ald', // Replace with your database name
});

// Read the JSON file
const migrateUsers = async () => {
  try {
    const rawData = fs.readFileSync("C:/Users/Maryum Urooj Ahmed/Downloads/aldonlinebackupreadable.json"); // Path to the JSON file
    const jsonData = JSON.parse(rawData);

    // Extracting user data from JSON
    const usersData = jsonData.__collections__.users;

    const userEntries = Object.keys(usersData).map((key) => ({
      uid: key,
      username: usersData[key].username,
      email: usersData[key].email,
      created_at: new Date(usersData[key].creationDate),
    }));

    // Insert into MySQL
    const query = `
      INSERT INTO users (uid, userName, email, created_at)
      VALUES ?
      ON DUPLICATE KEY UPDATE userName = VALUES(userName), email = VALUES(email);
    `;

    const values = userEntries.map(user => [
      user.uid,
      user.username,
      user.email,
      user.created_at,
    ]);

    const [result] = await pool.query(query, [values]);
    console.log(`Migration successful! Rows affected: ${result.affectedRows}`);
  } catch (error) {
    console.error('Error migrating users:', error);
  } finally {
    pool.end();
  }
};

// Run the migration
migrateUsers();
