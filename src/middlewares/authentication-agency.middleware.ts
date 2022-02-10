import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import * as authService from 'tecnoturis-authentication';
import t from 'typy';

@Injectable()
export class AuthenticationAgencyMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: () => void) {
    const tokenFromHeader: string = t(req, 'headers.authorization').safeObject;
    if (!tokenFromHeader) {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
    const token = tokenFromHeader.replace('Bearer ', '');

    try {
      const data = await authService.verify(token);
      if (!data) {
        throw new HttpException('Internal error.', HttpStatus.INTERNAL_SERVER_ERROR);
      }

      const agencyId = t(data, 'agency.id').safeObject;
      req['agencyId'] = agencyId;
    } catch (e) {
      console.error(e);
      throw new HttpException('Internal error.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    next();
  }
}
