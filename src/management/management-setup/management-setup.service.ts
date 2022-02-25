import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { ManagementHttpService } from '../services/management-http.service';

@Injectable()
export class ManagementSetupService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  getManagementSetup(): Promise<ManagementSetupDTO> {
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/management/api/v1/setup/`);
  }
}
