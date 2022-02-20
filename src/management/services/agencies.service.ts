import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { ManagementAgencyProviderById, ManagementProviderDTO } from '../../shared/dto/agencies.dto';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class AgenciesService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  getProvidersByAgencyId(agencyId: number, all?: boolean): Promise<ManagementProviderDTO[]> {
    return this.managementHttpService.get<ManagementProviderDTO[]>(
      `${this.appConfigService.BASE_URL}/management/api/v1/agency/${agencyId}/providers/?all=${all}`,
    );
  }

  getAgencyProviderDetailByIds(agencyId: number, providerId: number): Promise<ManagementAgencyProviderById> {
    return this.managementHttpService.get<ManagementAgencyProviderById>(
      `${this.appConfigService.BASE_URL}/management/api/v1/agency/provider/${agencyId}/agency-provider/${providerId}/`,
    );
  }
}
