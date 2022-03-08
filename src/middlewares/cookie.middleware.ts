import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
import t from 'typy';
import { CacheService } from '../shared/services/cache.service';
import { INSTANA_MONITORING_COOKIE } from '../shared/shared.constants';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  constructor(private readonly cacheService: CacheService<any>) {}

  async use(req: Request, res: any, next: () => void) {
    const cookie = t(req, 'headers.cookie').safeString;
    if (cookie) {
      const cookieValue = cookie
        .split(';')
        .find((value) => value.trim().startsWith('TSID'))
        ?.match(/[^=]+$/g)?.[0];
      if (cookieValue) {
        this.cacheService.set(INSTANA_MONITORING_COOKIE, cookieValue);
      } else {
        this.cacheService.delete(INSTANA_MONITORING_COOKIE);
      }
    } else {
      this.cacheService.delete(INSTANA_MONITORING_COOKIE);
    }

    next();
  }
}
