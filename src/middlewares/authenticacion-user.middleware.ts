import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import * as authenticationService from 'tecnoturis-authentication';
import t from 'typy';
import { CacheService } from '../shared/services/cache.service';
import { MANAGEMENT_CACHED_TOKEN_KEY } from '../shared/shared.constants';

@Injectable()
export class AuthenticationUserMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: CacheService<any>) {}

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
      this.cacheService.set(MANAGEMENT_CACHED_TOKEN_KEY, token);
    } catch (e) {
      console.error(e);
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
