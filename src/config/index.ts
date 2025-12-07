import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    frontend_url: process.env.FRONTEND_URL,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    SUPER_ADMIN_EMAIL : process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD : process.env.SUPER_ADMIN_PASSWORD as string,
  
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,

   SSL_COMMERZ_STORE_ID: process.env.SSL_COMMERZ_STORE_ID as string,
    SSL_COMMERZ_STORE_PASSWORD: process.env.SSL_COMMERZ_STORE_PASSWORD as string,
    SSL_COMMERZ_IS_SANDBOX: process.env.SSL_COMMERZ_IS_SANDBOX === 'true',
    SSL_COMMERZ_SECRET_KEY: process.env.SSL_COMMERZ_SECRET_KEY as string,
    BACKEND_URL: process.env.BACKEND_URL as string,
}