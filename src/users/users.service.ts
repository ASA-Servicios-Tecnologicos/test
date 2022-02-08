import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';

@Injectable()
export class UsersService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  login(loginPayload: LoginPayloadDTO): Promise<{ token: string }> {
    console.log(`${this.appConfigService.MANAGEMENT_URL}/api/v1/user/auth/token-auth/`)
    return this.managementHttpService.post<{ token: string }>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/user/auth/token-auth/`,
      loginPayload,
    );
  }
}
