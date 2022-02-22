import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class PackagesNewblueService {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) {}

  getPackagesNewBlue() {
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/packages-newblue/api/v1/`);
  }
}
