import { Injectable } from '@nestjs/common';
import { Console } from 'console';
import { ManagementService } from 'src/management/services/management.service';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { LoginPayloadDTO } from '../shared/dto/login-payload.dto';

@Injectable()
export class UsersService {
  constructor(private readonly managementService: ManagementService, private readonly appConfigService: AppConfigService) { }

  login(loginPayload: LoginPayloadDTO): Promise<{ token: string }> {
    return this.managementService.login(loginPayload);
  }
}
