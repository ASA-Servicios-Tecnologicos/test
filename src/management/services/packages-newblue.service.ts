import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class PackagesNewblueService {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) {}

  postPackagesNewblueReferencePrices(data) {
    return this.managementHttpService.post(`${this.appConfigService.BASE_URL}/packages-newblue/api/v1/referencePrices`, data);
  }
}
