import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ManagementService } from './management.service';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ManagementHttpService {
  constructor(private readonly httpService: HttpService, private managementService: ManagementService) {}

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
      .then((data) => data.data)
      .catch((err) => {
        // If token has expired then renew request token
        if (err.response.data?.detail === 'Signature has expired.') {
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
          Authorization: `Bearer ${await this.managementService.getCachedToken()}`,
        },
      }),
    )
      .then((data) => data.data)
      .catch((err) => {
        // If token has expired then renew request token
        if (err.response.data?.detail === 'Signature has expired.') {
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
                throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
              });
          });
        }
        throw new HttpException({ message: err.message, error: err.response.data || err.message }, err.response.status);
      });
  }
}
