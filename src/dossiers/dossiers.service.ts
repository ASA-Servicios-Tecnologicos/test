import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';

@Injectable()
export class DossiersService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) { }
  patchDossierById(id: number, newDossier) {
    return this.managementHttpService.patch(`${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${id}/`, newDossier);
  }


  findDossierById(id: string) {
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${id}/`);
  }
}
