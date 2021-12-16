import { registerAs } from '@nestjs/config';
export default registerAs('tecnoturis-app', () => ({
  port: process.env.PORT,
  HOST: process.env.HOST,
  MONGODB_URI: process.env.MONGODB_URI,
  SESSION_TOKEN_URL: process.env.SESSION_TOKEN_URL,
  SESSION_USERNAME: process.env.SESSION_USERNAME,
  SESSION_PASSWORD: process.env.SESSION_PASSWORD,
  SESSION_CLIENTID: process.env.SESSION_CLIENTID,
  CHECKOUT_URL: process.env.CHECKOUT_URL,
}));
