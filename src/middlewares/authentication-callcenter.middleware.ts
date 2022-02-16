import { Injectable, NestMiddleware, HttpStatus, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import * as authService from 'tecnoturis-authentication';
import t from 'typy';
import { CacheService } from '../shared/services/cache.service';
import { MANAGEMENT_CACHED_TOKEN_KEY } from '../shared/shared.constants';

@Injectable()
export class AuthenticationCallCenterMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: CacheService<any>) {}

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
      this.cacheService.set(MANAGEMENT_CACHED_TOKEN_KEY, token);
    } catch (e) {
      if (e.message && e.message === 'jwt expired') {
        throw new UnauthorizedException(e, e.message);
      }
      throw new InternalServerErrorException(e);
    }
    next();
  }
}
