import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import * as authenticationService from 'tecnoturis-authentication';
import t from 'typy';

@Injectable()
export class AuthenticationUserMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: any, next: () => void) {
    const tokenFromHeader: string = t(req, 'headers.authorization').safeObject;
    if (!tokenFromHeader) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
    const token = tokenFromHeader.replace('Bearer ', '');
    try {
      const data = await authenticationService.verify(token);
      if (!data) {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      console.error(e);
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
