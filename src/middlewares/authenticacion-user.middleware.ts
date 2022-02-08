import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import * as authenticationService from 'tecnoturis-authentication';

@Injectable()
export class AuthenticationUserMiddleware implements NestMiddleware {
  constructor() {}
  async use(req: Request, res: any, next: () => void) {
    const tokenFromHeader = req.headers.authorization;
    console.log(
      '🚀 ~ file: authenticacion-user.middleware.ts ~ line 10 ~ AuthenticationUserMiddleware ~ use ~ tokenFromHeader',
      tokenFromHeader,
    );
    if (!tokenFromHeader) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
    try {
      const data = await authenticationService.verify('');
      console.log('🚀 ~ file: authenticacion-user.middleware.ts ~ line 17 ~ AuthenticationUserMiddleware ~ use ~ data', data);

      if (!data) {
        throw new HttpException('Internal error.', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (e) {}
    next();
  }
}
