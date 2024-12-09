"use client";

import { z } from 'zod';
import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

const dbUrl = process.env.DATABASE_URL || "";
const sql = neon(dbUrl);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const sql = 'SELECT * FROM users WHERE username = $1 AND password = $2';
      const values = [username, password];
      const result = await sql(query, values);

      if (result.rows.length > 0) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Database query error', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}