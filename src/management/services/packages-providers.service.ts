import { HeadersDTO } from './../../shared/dto/header.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookingPackagesProvidersFilters } from '../../booking-packages/booking-packages.controller';
import { AppConfigService } from '../../configuration/configuration.service';
import { PostPreBookingsPackagesProvidersDTO, PreBookingsPackagesProvidersResponseDTO } from '../../shared/dto/booking-packages.dto';
import { ManagementHttpService } from './management-http.service';
import { logger } from '../../logger';
@Injectable()
export class PackagesProvidersService {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) {}

  getPackageProviders(queryParams?: BookingPackagesProvidersFilters, headers?: HeadersDTO) {
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/packages/flowo`, {
      params: queryParams,
      headers,
    });
  }

  postPreBookings(data: PostPreBookingsPackagesProvidersDTO, headers?: HeadersDTO): Promise<any> {
    return this.managementHttpService
      .post<PreBookingsPackagesProvidersResponseDTO>(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/pre-bookings`, data, {
        headers,
      })
      .then((response) => {
        if (response.status !== HttpStatus.OK) {
          logger.error(`[PackagesProvidersService] [postPreBookings] --response ${JSON.stringify(response)}`);
          throw new HttpException(response.data, response.status);
        }
        return response;
      });
  }
}
