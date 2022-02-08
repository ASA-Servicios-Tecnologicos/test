import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';

@Injectable()
export class UsersService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  login(loginPayload: LoginPayloadDTO): Promise<{ token: string }> {
    return this.managementHttpService.post<{ token: string }>(
      `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/user/auth/token-auth/`,
      loginPayload,
    );
  }
}