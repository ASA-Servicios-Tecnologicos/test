import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { EmailDTO } from '../../shared/dto/email.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';

@Injectable()
export class NotificationService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService) {
    super(http, appConfigService);
  }

  async sendMailRaw(data: EmailDTO) {
    return this.postSecured(this.appConfigService.EMAIL_RAW_URL, data);
  }
}
