import { Injectable } from '@nestjs/common';
import { PackagesNewblueService } from '../management/services/packages-newblue.service';
import { PackagesProvidersService } from '../management/services/packages-providers.service';
import { PostPreBookingsPackagesProvidersDTO, PreBookingsPackagesProvidersResponseDTO } from '../shared/dto/booking-packages.dto';
import { BookingPackagesProvidersFilters, HeadersDTO } from './booking-packages.controller';

@Injectable()
export class BookingPackagesService {
  constructor(
    private readonly packagesNewBlueService: PackagesNewblueService,
    private readonly packagesProvidersService: PackagesProvidersService,
  ) { }

  getBookingPackagesProviders(queryParams?: BookingPackagesProvidersFilters, headers?:HeadersDTO) {
    return this.packagesProvidersService.getPackageProviders(queryParams, headers);
  }

  postPrebookingsPackagesProviders(postPreBookingsPackagesProvidersDTO: PostPreBookingsPackagesProvidersDTO): Promise<any> {
    return this.packagesProvidersService.postPreBookings(postPreBookingsPackagesProvidersDTO);
  }

  postNewBlueReferencePrices(data, headers?:HeadersDTO) {
    return this.packagesNewBlueService.postPackagesNewblueReferencePrices(data, headers);
  }
}
