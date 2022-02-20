import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { ManagementBookingServiceDTO, ManagementBookingServicesByDossierDTO } from '../../shared/dto/booking-service.dto';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class BookingServicesService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  getBookingServicesByDossierId(dossierId: string): Promise<ManagementBookingServicesByDossierDTO[]> {
    return this.managementHttpService.get<ManagementBookingServicesByDossierDTO[]>(
      `${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${dossierId}/booking-service/`,
    );
  }

  getBookingServiceById(id: string): Promise<ManagementBookingServiceDTO> {
    return this.managementHttpService.get<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/`,
    );
  }

  createBookingService(createBookingServiceDTO) {
    return this.managementHttpService.post<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/`,
      createBookingServiceDTO,
    );
  }

  patchBookingServiceById(
    id: number,
    managementDossierServiceDTO: Partial<ManagementBookingServiceDTO>,
  ): Promise<ManagementBookingServiceDTO> {
    return this.managementHttpService.patch<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/`,
      managementDossierServiceDTO,
    );
  }

  deleteBookingServiceById(id: number) {
    return this.managementHttpService.delete(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/`);
  }

  createBookingServicePax(createBookingServicePaxDTO) {
    return this.managementHttpService.post<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/pax/`,
      createBookingServicePaxDTO,
    );
  }

  deleteBookingServicePaxById(paxId: number): Promise<void> {
    return this.managementHttpService.delete(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/pax/${paxId}/`);
  }
}
