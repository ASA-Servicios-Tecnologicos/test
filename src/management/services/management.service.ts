import { HttpService, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../../configuration/configuration.service';
import { CacheService } from '../../shared/services/cache.service';
import { MANAGEMENT_CACHED_TOKEN_KEY } from '../../shared/shared.constants';

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

  async getCachedToken(): Promise<string> {
    let token = this.cacheService.get(MANAGEMENT_CACHED_TOKEN_KEY);
    if (!token) {
      const authData: { username: string; password: string } = {
        username: this.appConfigService.MANAGEMENT_USERNAME,
        password: this.appConfigService.MANAGEMENT_PASSWORD,
      };
      const requestToken = await firstValueFrom(
        this.http.post<{ token: string }>(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/user/auth/token-auth/`, authData),
      );
      token = requestToken.data.token;
      this.cacheService.set(MANAGEMENT_CACHED_TOKEN_KEY, requestToken.data.token);
    }
    return token;
  }

  refreshCacheToken(): Promise<string> {
    this.cacheService.set(MANAGEMENT_CACHED_TOKEN_KEY, null);
    return this.getCachedToken();
  }
}
