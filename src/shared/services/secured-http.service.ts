import { HttpException, HttpService } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { NotificationSessionDTO } from '../dto/notification-session.dto';
import { AppConfigService } from '../../configuration/configuration.service';
import { CacheService } from './cache.service';
import { INSTANA_MONITORING_COOKIE } from '../shared.constants';
import { logger } from '../../logger';

export abstract class SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService, readonly cacheService: CacheService<any>) {
    this.http.axiosRef.interceptors.request.use((config) => {
      const cookie = this.cacheService.get(INSTANA_MONITORING_COOKIE);
      if (this.cacheService.get(INSTANA_MONITORING_COOKIE)) {
        config.headers['monit-tsid'] = cookie;
      }
      return config;
    });
  }

  protected getSessionToken(): Promise<string> {
    const data = new URLSearchParams();
    data.append('scope', this.appConfigService.SESSION_SCOPE);
    data.append('grant_type', this.appConfigService.SESSION_GRANT_TYPE);
    data.append('username', this.appConfigService.SESSION_USERNAME);
    data.append('password', this.appConfigService.SESSION_PASSWORD);
    data.append('client_id', this.appConfigService.SESSION_CLIENTID);
    data.append('client_secret', this.appConfigService.SESSION_CLIENT_SECRET);

    logger.info(`[SecuredHttpService] [getSessionToken] --url ${this.appConfigService.SESSION_TOKEN_URL} --data ${data}`);

    return lastValueFrom(
      this.http
        .post<NotificationSessionDTO>(this.appConfigService.SESSION_TOKEN_URL, data.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .pipe(map((result) => result.data.access_token)),
    ).catch((error) => {
      logger.error(`[SecuredHttpService] [getSessionToken] ${error.stack}`);
      return error;
    });
  }

  protected async postSecured(url: string, data?: any) {
    logger.info(`[SecuredHttpService] [postSecured] --url ${url}`);
    const token = await this.getSessionToken();

    return lastValueFrom(
      this.http.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          commerce: 'FLOWO',
          'Accept-Language': 'es_ES',
          Authorization: `Bearer ${token}`,
        },
      }),
    ).catch((error) => {
      logger.error(`[SecuredHttpService] [postSecured] ${error.stack}`);

      throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
    });
  }

  protected async getSecured(url: string, body?) {
    logger.info(`[SecuredHttpService] [getSecured] --url ${url}`);
    const token = await this.getSessionToken();
    console.log(url);
    return lastValueFrom(
      this.http
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            commerce: 'FLOWO',
            'Accept-Language': 'es_ES',
            Authorization: `Bearer ${token}`,
          },
          data: body,
        })
        .pipe(map((res) => res.data)),
    ).catch((error) => {
      logger.error(`[SecuredHttpService] [getSecured] ${error.stack}`);
      throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
    });
  }
}
