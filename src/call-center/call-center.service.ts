import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { CallCenterBookingFilterParamsDTO, ManagementDossierByAgency } from '../shared/dto/call-center.dto';

@Injectable()
export class CallCenterService {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) {}
  getDossiersByAgencyId(agencyId: string, filterParams: CallCenterBookingFilterParamsDTO) {
    return this.managementHttpService.get<ManagementDossierByAgency>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/agency/${agencyId}/dossier/`,
    );
  }
}
