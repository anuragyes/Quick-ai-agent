import dotenv from 'dotenv';
dotenv.config(); // Load environment variables


import { neon } from '@neondatabase/serverless';

const sql = neon(`${process.env.DATABASE_URL}`);  // Using the DATABASE_URL from .env

export default sql;
