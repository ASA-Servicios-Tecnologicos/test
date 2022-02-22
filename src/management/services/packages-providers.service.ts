import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { PostPreBookingsPackagesProvidersDTO, PreBookingsPackagesProvidersResponseDTO } from '../../shared/dto/booking-packages.dto';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class PackagesProvidersService {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) {}

  getPackageProviders() {
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/packages`);
  }

  postPreBookings(data: PostPreBookingsPackagesProvidersDTO): Promise<PreBookingsPackagesProvidersResponseDTO> {
    return this.managementHttpService
      .post<PreBookingsPackagesProvidersResponseDTO>(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/pre-bookings`, data)
      .then((response) => {
        if (response.status !== HttpStatus.OK) {
          throw new HttpException(response.data, response.status);
        }
        return response;
      });
  }
}
