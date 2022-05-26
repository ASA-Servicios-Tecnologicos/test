import { Injectable } from '@nestjs/common';
import { DossierDto } from 'src/shared/dto/dossier.dto';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';

@Injectable()
export class DossiersService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  patchDossierById(id: number, newDossier) {
    return this.managementHttpService.patch(`${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${id}/`, newDossier);
  }

  patchBookingServiceById(id: number, service: any) {
    return this.managementHttpService.patch(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/`, service);
  }

  findDossierById(id: string) {
    return this.managementHttpService.get<DossierDto>(`${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${id}/`);
  }
}
