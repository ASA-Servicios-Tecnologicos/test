import { registerAs } from '@nestjs/config';
export default registerAs('tecnoturis-app', () => ({
  port: process.env.PORT,
  HOST: process.env.HOST,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_TOKEN_URL: process.env.SESSION_TOKEN_URL,
  SESSION_USERNAME: process.env.SESSION_USERNAME,
  SESSION_PASSWORD: process.env.SESSION_PASSWORD,
  SESSION_CLIENTID: process.env.CLIENT_ID,
  SESSION_SCOPE: process.env.SESION_SCOPE,
  SESSION_GRANT_TYPE: process.env.SESSION_GRANT_TYPE,
  SESSION_CLIENT_SECRET: process.env.CLIENT_SECRET,
  CHECKOUT_URL: process.env.CHECKOUT_URL,
  BASE_URL: process.env.BASE_URL,
  MANAGEMENT_USERNAME: process.env.MANAGEMENT_USERNAME,
  MANAGEMENT_PASSWORD: process.env.MANAGEMENT_PASSWORD,
  DISCOUNT_CODE_URL: process.env.DISCOUNT_CODE_URL,
  EMAIL_RAW_URL: process.env.EMAIL_RAW_URL,
  EMAIL_TEMPLATED_URL: process.env.EMAIL_TEMPLATED_URL,
  W2M_URL: process.env.W2M_URL,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  CONTENT_URL: process.env.CONTENT_URL,
  CLIENT_GENERAL: process.env.CLIENT_GENERAL,
}));
