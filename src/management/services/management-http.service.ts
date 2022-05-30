import { HttpException, HttpService, HttpStatus, Injectable, InternalServerErrorException, Headers } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ManagementService } from './management.service';
import { AxiosRequestConfig } from 'axios';
import { CacheService } from 'src/shared/services/cache.service';
import { INSTANA_MONITORING_COOKIE } from 'src/shared/shared.constants';

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
      if (!config.headers['monit-tsid'] && this.cacheService.get(INSTANA_MONITORING_COOKIE)) {
        config.headers['monit-tsid'] = cookie;
      }
      return config;
    });
  }

  async post<K>(url: string, data: object = {}, config?: AxiosRequestConfig): Promise<K> {
    return firstValueFrom(
      this.httpService.post<K>(url, data, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.managementService.getCachedToken()}`,
          'monit-tsid' : config?.headers['monit-tsid'] ? config?.headers['monit-tsid'] : null
        },
      }),
    )
      .then((data) => {
        return data.data;
      })
      .catch((err) => {
        // If token has expired then renew request token
        if (err.response.status === HttpStatus.UNAUTHORIZED && (err.response.data?.detail === 'Signature has expired.' || err.response.data?.message === 'Not authorized.')) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.post<K>(url, data, {
                ...config,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newToken}`,
                  'monit-tsid' : config?.headers['monit-tsid'] ? config?.headers['monit-tsid'] : null
                },
              }),
            )
              .then((data) => data.data)
              .catch((err) => {
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
      });
  }

  async get<K>(url: string, config?: AxiosRequestConfig): Promise<K> {
    return firstValueFrom(
      this.httpService.get<K>(url, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.managementService.getCachedToken()}`,
          'monit-tsid' : config?.headers['monit-tsid'] ? config?.headers['monit-tsid'] : null
        },
      }),
    )
      .then((data) => data.data)
      .catch((err) => {
        // If token has expired then renew request token
        if (err.response.status === HttpStatus.UNAUTHORIZED && (err.response.data?.detail === 'Signature has expired.' || err.response.data?.message === 'Not authorized.')) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.get<K>(url, {
                ...config,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newToken}`,
                  'monit-tsid' : config?.headers['monit-tsid'] ? config?.headers['monit-tsid'] : null
                },
              }),
            )
              .then((data) => {
                return data.data;
              })
              .catch((err) => {
                throw new HttpException(
                  { message: err.message, error: err.response.data ? err.response.data : err.message },
                  err.response.status,
                );
              });
          });
        }
        throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
      });
  }

  async patch<K>(url: string, data: object = {}, config?: AxiosRequestConfig): Promise<K> {
    return firstValueFrom(
      this.httpService.patch<K>(url, data, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.managementService.getCachedToken()}`,
        },
      }),
    )
      .then((data) => data.data)
      .catch((err) => {
        // If token has expired then renew request token
        if (err.response.status === HttpStatus.UNAUTHORIZED && (err.response.data?.detail === 'Signature has expired.' || err.response.data?.message === 'Not authorized.')) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.patch<K>(url, data, {
                ...config,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newToken}`,
                },
              }),
            )
              .then((data) => {
                return data.data;
              })
              .catch((err) => {
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
      });
  }

  async put<K>(url: string, data: object = {}, config?: AxiosRequestConfig): Promise<K> {
    return firstValueFrom(
      this.httpService.put<K>(url, data, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.managementService.getCachedToken()}`,
        },
      }),
    )
      .then((data) => data.data)
      .catch((err) => {
        // If token has expired then renew request token
        if (err.response.status === HttpStatus.UNAUTHORIZED && (err.response.data?.detail === 'Signature has expired.' || err.response.data?.message === 'Not authorized.')) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.put<K>(url, data, {
                ...config,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newToken}`,
                },
              }),
            )
              .then((data) => {
                return data.data;
              })
              .catch((err) => {
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
      });
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<void> {
    return firstValueFrom(
      this.httpService.delete(url, {
        ...config,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await this.managementService.getCachedToken()}`,
        },
      }),
    )
      .then(() => {
        return;
      })
      .catch((err) => {
        // TODO: Why this error when it deletes favourite successfully?
        if (err.code === 'ECONNRESET') {
          return;
        }
        // If token has expired then renew request token
        if (err.response.status === HttpStatus.UNAUTHORIZED && (err.response.data?.detail === 'Signature has expired.' || err.response.data?.message === 'Not authorized.')) {
          return this.managementService.refreshCacheToken().then((newToken) => {
            return firstValueFrom(
              this.httpService.delete(url, {
                ...config,
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${newToken}`,
                },
              }),
            )
              .then(() => {
                return;
              })
              .catch((err) => {
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
      });
  }
}
