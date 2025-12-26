import ms from 'ms';
import { env } from './env';

const DEFAULT_PASSWORD_RESET_TTL = 10 * 60 * 1000;

export default {
  port: env.PORT,
  database_url: env.DATABASE_URL,
  node_env: env.NODE_ENV,

  jwt_access_secret: env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: env.JWT_REFRESH_EXPIRES_IN,

  password_reset_expires_in: env.PASSWORD_RESET_EXPIRES_IN
    ? ms(env.PASSWORD_RESET_EXPIRES_IN)
    : DEFAULT_PASSWORD_RESET_TTL,
  
  super_admin_email: env.SUPER_ADMIN_EMAIL,
  super_admin_password: env.SUPER_ADMIN_PASSWORD,
};
