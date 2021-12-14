import { registerAs } from '@nestjs/config';
export default registerAs('tecnoturis-app', () => ({
  port: process.env.PORT,
  HOST: process.env.HOST,
  MONGODB_URI: process.env.MONGODB_URI,
}));