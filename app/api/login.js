// pages/api/login.js
import { Client } from 'pg';
import admin from '../../_utils/firebaseAdmin';

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Authenticate with Firebase
      const userRecord = await admin.auth().getUserByEmail(email);

      // Verify password (this is just an example, you should use a secure method)
      const isPasswordValid = password === userRecord.passwordHash; // Replace with actual password verification

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Add user details to PostgreSQL database
      const query = 'INSERT INTO users (uid, email) VALUES ($1, $2) ON CONFLICT (uid) DO NOTHING';
      const values = [userRecord.uid, userRecord.email];
      await client.query(query, values);

      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error during authentication or database operation', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}