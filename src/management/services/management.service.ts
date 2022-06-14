import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LoginPayloadDTO } from 'src/shared/dto/login-payload.dto';
import { AppConfigService } from '../../configuration/configuration.service';
import { CacheService } from '../../shared/services/cache.service';
import { MANAGEMENT_CACHED_TOKEN_KEY } from '../../shared/shared.constants';
import { logger } from '../../logger';
@Injectable()
export class ManagementService {
  constructor(
    private readonly http: HttpService,
    private readonly appConfigService: AppConfigService,
    private readonly cacheService: CacheService<any>,
  ) {}

  auth(): Promise<string> {
    return this.getCachedToken();
  }

  async login(loginPayloadDto: LoginPayloadDTO): Promise<{ token: string }> {
    logger.info(`[ManagementService] [login] init method`)
    const requestToken = await firstValueFrom(
      this.http.post<{ token: string }>(`${this.appConfigService.BASE_URL}/management/api/v1/user/auth/token-auth/`, loginPayloadDto),
    ).catch((err) => {
      logger.error(`[ManagementService] [login] ${err.stack}`)
      throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
    });
    return { token: requestToken.data.token };
  }

  async getCachedToken(): Promise<string> {
    logger.info(`[ManagementService] [getCachedToken] init method`)
    let token = this.cacheService.get(MANAGEMENT_CACHED_TOKEN_KEY);
    if (!token) {
      const authData: { username: string; password: string } = {
        username: this.appConfigService.MANAGEMENT_USERNAME,
        password: this.appConfigService.MANAGEMENT_PASSWORD,
      };
      const requestToken = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.appConfigService.BASE_URL}/management/api/v1/user/auth/token-auth/`, authData),
      ).catch((err) => {
        logger.error(`[ManagementService] [getCachedToken] ${err.stack}`)
        throw new Error(err);
      });
      token = requestToken.data.token;
      this.cacheService.set(MANAGEMENT_CACHED_TOKEN_KEY, requestToken.data.token);
    }
    return token;
  }

  refreshCacheToken(): Promise<string> {
    logger.info(`[ManagementService] [refreshCacheToken] init method`)
    this.cacheService.set(MANAGEMENT_CACHED_TOKEN_KEY, null);
    return this.getCachedToken();
  }
}
