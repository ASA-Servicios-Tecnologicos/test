import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ManagementService } from './management.service';
import { AxiosRequestConfig } from 'axios';
import { CacheService } from 'src/shared/services/cache.service';
import { INSTANA_MONITORING_COOKIE } from 'src/shared/shared.constants';
import { logger } from '../../logger';

@Injectable()
export class ManagementHttpService {
  constructor(
    private readonly httpService: HttpService,
    private managementService: ManagementService,
    private cacheService: CacheService<any>,
  ) {
    //It is executed after the requests adding parameters as the headers
    this.httpService.axiosRef.interceptors.request.use((config) => {
      const cookie = this.cacheService.get(INSTANA_MONITORING_COOKIE);
      if (config && config.headers && !config.headers['monit-tsid'] && this.cacheService.get(INSTANA_MONITORING_COOKIE)) {
        config.headers['monit-tsid'] = cookie;
      }
      return config;
    });
  }

  async post<K>(url: string, data: object = {}, config?: AxiosRequestConfig): Promise<K> {
    logger.info(`[ManagementHttpService] [post] --url ${url}`)
    return firstValueFrom(
      this.httpService.post<K>(url, data, {
        ...config,
        headers: this.buildHeaders(config, await this.managementService.getCachedToken()),
      }),
    )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        // If token has expired then renew request token
        if (
          error.response.status === HttpStatus.UNAUTHORIZED &&
          (error.response.data?.detail === 'Signature has expired.' || error.response.data?.message === 'Not authorized.')
        ) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.post<K>(url, data, {
                ...config,
                headers: this.buildHeaders(config, newToken),
              }),
            )
              .then((res) => res.data)
              .catch((err) => {
                logger.error(`[ManagementHttpService] [post] ${err.stack}`)
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        logger.error(`[ManagementHttpService] [post] ${error.stack}`)
        throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
      });
  }

  async get<K>(url: string, config?: AxiosRequestConfig): Promise<K> {
    logger.info(`[ManagementHttpService] [get] --url ${url}`)
    return firstValueFrom(
      this.httpService.get<K>(url, {
        ...config,
        headers: this.buildHeaders(config, await this.managementService.getCachedToken()),
      }),
    )
      .then((data) => data.data)
      .catch((error) => {
        // If token has expired then renew request token
        if (
          error.response.status === HttpStatus.UNAUTHORIZED &&
          (error.response.data?.detail === 'Signature has expired.' || error.response.data?.message === 'Not authorized.')
        ) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.get<K>(url, {
                ...config,
                headers: this.buildHeaders(config, newToken),
              }),
            )
              .then((data) => {
                return data.data;
              })
              .catch((err) => {
                logger.error(`[ManagementHttpService] [get] ${err.stack}`)
                throw new HttpException(
                  { message: err.message, error: err.response.data ? err.response.data : err.message },
                  err.response.status,
                );
              });
          });
        }
        logger.error(`[ManagementHttpService] [get] ${error.stack}`)
        throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
      });
  }

  async patch<K>(url: string, data: object = {}, config?: AxiosRequestConfig): Promise<K> {
    logger.info(`[ManagementHttpService] [patch] --url ${url}`)
    return firstValueFrom(
      this.httpService.patch<K>(url, data, {
        ...config,
        headers: this.buildHeaders(config, await this.managementService.getCachedToken())
      }),
    )
      .then((response) => response.data)
      .catch((error) => {
        // If token has expired then renew request token
        if (
          error.response.status === HttpStatus.UNAUTHORIZED &&
          (error.response.data?.detail === 'Signature has expired.' || error.response.data?.message === 'Not authorized.')
        ) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.patch<K>(url, data, {
                ...config,
                headers: this.buildHeaders(config, newToken)
              }),
            )
              .then((res) => {
                return res.data;
              })
              .catch((err) => {
                logger.error(`[ManagementHttpService] [patch] ${err.stack}`)
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        logger.error(`[ManagementHttpService] [patch] ${error.stack}`)
        throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
      });
  }

  async put<K>(url: string, data: object = {}, config?: AxiosRequestConfig): Promise<K> {
    logger.info(`[ManagementHttpService] [put] --url ${url}`)
    return firstValueFrom(
      this.httpService.put<K>(url, data, {
        ...config,
        headers:  this.buildHeaders(config, await this.managementService.getCachedToken())
      }),
    )
      .then((response) => response.data)
      .catch((error) => {
        // If token has expired then renew request token
        if (
          error.response.status === HttpStatus.UNAUTHORIZED &&
          (error.response.data?.detail === 'Signature has expired.' || error.response.data?.message === 'Not authorized.')
        ) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.put<K>(url, data, {
                ...config,
                headers: this.buildHeaders(config, newToken)
              }),
            )
              .then((res) => {
                return res.data;
              })
              .catch((err) => {
                logger.error(`[ManagementHttpService] [put] ${err.stack}`)
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        logger.error(`[ManagementHttpService] [put] ${error.stack}`)
        throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
      });
  }



  async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
    logger.info(`[ManagementHttpService] [delete] --url ${url}`)
    return firstValueFrom(
      this.httpService.delete(url, {
        ...config,
        headers: this.buildHeaders(config, await this.managementService.getCachedToken())
      }),
    )
      .then(() => {
        return;
      })
      .catch((error) => {
        // TODO: Why this error when it deletes favourite successfully?
        if (error.code === 'ECONNRESET') {
          return;
        }
        // If token has expired then renew request token
        if (
          error.response.status === HttpStatus.UNAUTHORIZED &&
          (error.response.data?.detail === 'Signature has expired.' || error.response.data?.message === 'Not authorized.')
        ) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.delete(url, {
                ...config,
                headers: this.buildHeaders(config, newToken)
              }),
            )
              .then(() => {
                return;
              })
              .catch((err) => {
                logger.error(`[ManagementHttpService] [delete] ${err.stack}`)
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        logger.error(`[ManagementHttpService] [delete] ${error.stack}`)
        throw new HttpException({ message: error.message, error: error.response.data || error.message }, error.response.status);
      });
  }


  buildHeaders(config?: AxiosRequestConfig, token?: string) {
    
    const tokenCC = config?.headers?.['tokenCC']
    l.info(`[ManagementHttpService] [buildHeaders] use ${ tokenCC ? 'call-center-frontend' : 'ota-backend'} token`)

    const headers: any = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenCC ? tokenCC : token}`,
    };
    if (config && config.headers && config.headers['monit-tsid']) {
      headers['monit-tsid'] = config.headers['monit-tsid'];
    }

    return headers;
  }

}
