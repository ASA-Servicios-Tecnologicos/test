import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configuration/configuration.service';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';
import { ManagementService } from '../management/services/management.service';

@Injectable()
export class UsersService {
  constructor(private readonly managementService: ManagementService, private readonly appConfigService: AppConfigService) { }

  login(loginPayload: LoginPayloadDTO): Promise<{ token: string }> {
    return this.managementService.login(loginPayload);
  }
}
