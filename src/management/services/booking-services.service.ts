import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../../configuration/configuration.service';
import { ManagementBookingServiceDTO, ManagementBookingServicesByDossierDTO } from '../../shared/dto/booking-service.dto';
import { ManagementService } from './management.service';

@Injectable()
export class BookingServicesService {
  constructor(
    private readonly managementService: ManagementService,
    private readonly http: HttpService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async getBookingServicesByDossierId(dossierId: string): Promise<ManagementBookingServicesByDossierDTO[]> {
    const token = await this.managementService.auth();

    return firstValueFrom(
      this.http.get<ManagementBookingServicesByDossierDTO[]>(
        `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/clients/dossier/${dossierId}/booking-service/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    )
      .then((res) => res.data)
      .catch((err) => {
        throw new HttpException(err.message, err.response.status);
      });
  }

  async getBookingServiceById(id: string): Promise<ManagementBookingServiceDTO> {
    const token = await this.managementService.auth();

    return firstValueFrom(
      this.http.get<ManagementBookingServiceDTO>(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/booking-service/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    )
      .then((res) => res.data)
      .catch((err) => {
        throw new HttpException(err.message, err.response.status);
      });
  }
}
