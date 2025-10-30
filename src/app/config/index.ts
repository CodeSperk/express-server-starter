import dotenv from 'dotenv';
import path from 'path';

//process.cwd() to get current path and join .env to get full path
dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
};
