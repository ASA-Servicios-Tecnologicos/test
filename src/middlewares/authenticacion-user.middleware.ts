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
      console.log('🚀 ~ file: authenticacion-user.middleware.ts ~ line 20 ~ AuthenticationUserMiddleware ~ use ~ data', data);
      if (!data) {
        throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
      }
      const agencyId = t(data, 'agency.id').safeObject;
      const agencyChainId = t(data, 'agency_chain.id').safeObject;
      req['agencyId'] = agencyId;
      req['agencyChainId'] = agencyChainId;
      this.cacheService.set(MANAGEMENT_CACHED_TOKEN_KEY, token);
    } catch (e) {
      console.error(e);
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
    next();
  }
}
