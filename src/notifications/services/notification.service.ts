import { HttpService, Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import FormData from 'form-data';
import { AppConfigService } from '../../configuration/configuration.service';
import { NotificationSessionDTO } from '../../shared/dto/notification-session.dto';
import { EmailRawDTO } from '../../shared/dto/email-raw.dto';
import { EmailTemplatedDTO } from '../../shared/dto/email-templated.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';

@Injectable()
export class NotificationService extends SecuredHttpService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService
  ) {
    super(http, appConfigService);
  }

  async sendMailRaw(data: EmailRawDTO) {
    return this.postSecured(this.appConfigService.EMAIL_RAW_URL, data);
  }

  async sendMailTemplated(data: EmailTemplatedDTO) {
    return this.postSecured(this.appConfigService.EMAIL_TEMPLATED_URL, data);
  }
}
