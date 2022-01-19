import { HttpService } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { NotificationSessionDTO } from '../dto/notification-session.dto';
import { AppConfigService } from '../../configuration/configuration.service';

export abstract class SecuredHttpService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService
  ) {}

  protected getSessionToken(): Promise<string> {
    const data = new URLSearchParams();
    data.append('scope', this.appConfigService.SESSION_SCOPE)
    data.append('grant_type', this.appConfigService.SESSION_GRANT_TYPE);
    data.append('username', this.appConfigService.SESSION_USERNAME);
    data.append('password', this.appConfigService.SESSION_PASSWORD);
    data.append('client_id', this.appConfigService.SESSION_CLIENTID);
    data.append('client_secret', this.appConfigService.SESSION_CLIENT_SECRET);

    return lastValueFrom(
      this.http
        .post<NotificationSessionDTO>(
          this.appConfigService.SESSION_TOKEN_URL,
          data.toString(),
          { headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
        )
        .pipe(map((result) => result.data.access_token))
    ).catch(error => {
      console.log(error)
      return error;
    });
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
    ).catch(error => console.log(error))
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
