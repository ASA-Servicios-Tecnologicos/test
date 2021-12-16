import { HttpService } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import * as FormData from 'form-data';
import { NotificationSessionDTO } from '../dto/notification-session.dto';
import { AppConfigService } from '../../configuration/configuration.service';

export abstract class SecuredHttpService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService
  ) {}

  protected getSessionToken(): Promise<string> {
    let bodyFormData = new FormData();
    bodyFormData.append('grant_type', 'password');
    console.log(this.appConfigService.SESSION_USERNAME);
    console.log(this.appConfigService.SESSION_PASSWORD);
    console.log(this.appConfigService.SESSION_CLIENTID);
    bodyFormData.append('username', this.appConfigService.SESSION_USERNAME);
    bodyFormData.append('password', this.appConfigService.SESSION_PASSWORD);
    bodyFormData.append('client_id', this.appConfigService.SESSION_CLIENTID);
    return lastValueFrom(
      this.http
        .post<NotificationSessionDTO>(
          this.appConfigService.SESSION_TOKEN_URL,
          bodyFormData,
          { headers: bodyFormData.getHeaders() }
        )
        .pipe(map((result) => result.data.access_token))
    );
  }

  protected async postSecured(url: string, data?: any) {
    const token = await this.getSessionToken();
    return lastValueFrom(
      this.http.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }

  protected async getSecured(url: string) {
    const token = await this.getSessionToken();
    return lastValueFrom(
      this.http.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }
}
