import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { every, pickBy, some } from 'lodash';
import { filter } from 'rxjs';
import { AppConfigService } from '../configuration/configuration.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { ManagementBookingServiceDTO, ManagementBookingServicesByDossierDTO } from '../shared/dto/booking-service.dto';
import { CallCenterBookingFilterParamsDTO, GetDossiersByClientDTO, ManagementDossierByAgency } from '../shared/dto/call-center.dto';

@Injectable()
export class CallCenterService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly managementHttpService: ManagementHttpService,
    private readonly bookingServicesService: BookingServicesService,
  ) {}
  async getDossiersByAgencyId(agencyId: string, filterParams: CallCenterBookingFilterParamsDTO) {
    const managementDossierByAgency: GetDossiersByClientDTO = await this.managementHttpService.get<GetDossiersByClientDTO>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/agency/${agencyId}/dossier/${this.mapFilterParamsToQueryParams(
        pickBy(filterParams),
      )}`,
    );
    const results = await Promise.all(
      managementDossierByAgency.results.map(async (managementDossierByAgency: ManagementDossierByAgency) => {
        const managementBookingServicesByDossierDTO: ManagementBookingServicesByDossierDTO[] =
          await this.bookingServicesService.getBookingServicesByDossierId(`${managementDossierByAgency.id}`);
        const managementBookingServicesDetailedDTO: ManagementBookingServiceDTO[] = await Promise.all(
          managementBookingServicesByDossierDTO.map((managementBookingServicesByDossierDTO: ManagementBookingServicesByDossierDTO) => {
            return this.bookingServicesService.getBookingServiceById(`${managementBookingServicesByDossierDTO.id}`);
          }),
        );
        return { ...managementDossierByAgency, services: managementBookingServicesDetailedDTO };
      }),
    );
    return { ...managementDossierByAgency, results };
  }

  private mapFilterParamsToQueryParams(filterParams: CallCenterBookingFilterParamsDTO): string {
    let result = '?';

    Object.keys(filterParams).forEach((key, index) => {
      result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
    });

    return encodeURI(result);
  }
}
