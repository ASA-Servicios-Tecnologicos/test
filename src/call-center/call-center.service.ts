import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import { every, pickBy, some } from 'lodash';
import { filter } from 'rxjs';
import { AppConfigService } from '../configuration/configuration.service';
import { DossiersService } from '../dossiers/dossiers.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { ClientService } from '../management/services/client.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { PaymentsService } from '../payments/payments.service';
import { ManagementBookingServiceDTO, ManagementBookingServicesByDossierDTO } from '../shared/dto/booking-service.dto';
import { CallCenterBookingFilterParamsDTO, GetDossiersByClientDTO, ManagementDossierByAgency } from '../shared/dto/call-center.dto';

@Injectable()
export class CallCenterService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly managementHttpService: ManagementHttpService,
    private readonly bookingServicesService: BookingServicesService,
    private readonly clientService: ClientService,
    private readonly paymentsService: PaymentsService,
    private readonly dossiersService: DossiersService,
  ) {}

  getDossiersByAgencyId(agencyId: string, filterParams: CallCenterBookingFilterParamsDTO) {
    // return { ...managementDossierByAgency, results };
    return this.managementHttpService.get<GetDossiersByClientDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/agency/${agencyId}/dossier/${this.mapFilterParamsToQueryParams(
        pickBy(filterParams),
      )}`,
    );
  }

  patchDossierById(id: number, newDossier) {
    return this.dossiersService.patchDossierById(id, newDossier);
  }

  private mapFilterParamsToQueryParams(filterParams: CallCenterBookingFilterParamsDTO): string {
    let result = '?';

    Object.keys(filterParams).forEach((key, index) => {
      result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
    });

    return encodeURI(result);
  }
}
