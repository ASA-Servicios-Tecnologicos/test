import { HttpException, HttpService, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
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
    this.httpService.axiosRef.interceptors.request.use((config) => {
      const cookie = this.cacheService.get(INSTANA_MONITORING_COOKIE);
      if (this.cacheService.get(INSTANA_MONITORING_COOKIE)) {
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
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NTYyLCJyb2xlIjp7ImlkIjoyLCJuYW1lIjoiRGlyZWN0b3IgZGUgQWdlbmNpYSIsImFjdGl2ZSI6dHJ1ZX0sImFnZW5jeV9jaGFpbiI6eyJpZCI6MywibmFtZSI6IkZsb3dvIiwic2hhcmVfY2xpZW50cyI6ZmFsc2V9LCJhZ2VuY3kiOnsiaWQiOjMsIm5hbWUiOiJGbG93byBDZW50cmFsIiwiYWdlbmN5X2NoYWluX2lkIjozfSwidXNlcm5hbWUiOiJmbG93b2RldiIsImZpcnN0X25hbWUiOiJGbG93b0RldiIsImxhc3RfbmFtZSI6IkludGVncmF0aW9uIiwiZW1haWwiOiJwcnVlYmFAdGVjbm90dXJpcy5lcyIsImxvZ28iOm51bGwsImNsaWVudCI6bnVsbCwiYWdlbmNpZXNfYXNzb2NpYXRlZCI6W10sImV4cCI6MTY0ODE2Mzg5Nywib3JpZ19pYXQiOjE2NDgxMDYyOTd9.g2SikWVigDKnDSTelrXTKxZ_UDOUlbiPLY87m-UVYZA`,
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
