import { HeadersDTO } from './../shared/dto/header.dto';
import { Injectable } from '@nestjs/common';
import { PackagesNewblueService } from '../management/services/packages-newblue.service';
import { PackagesProvidersService } from '../management/services/packages-providers.service';
import { PostPreBookingsPackagesProvidersDTO } from '../shared/dto/booking-packages.dto';
import { BookingPackagesProvidersFilters } from './booking-packages.controller';

@Injectable()
export class BookingPackagesService {
  constructor(
    private readonly packagesNewBlueService: PackagesNewblueService,
    private readonly packagesProvidersService: PackagesProvidersService,
  ) { }

  getBookingPackagesProviders(queryParams?: BookingPackagesProvidersFilters, headers?:HeadersDTO) {
    return this.packagesProvidersService.getPackageProviders(queryParams, headers);
  }

  postPrebookingsPackagesProviders(postPreBookingsPackagesProvidersDTO: PostPreBookingsPackagesProvidersDTO, headers?:HeadersDTO): Promise<any> {
    return this.packagesProvidersService.postPreBookings(postPreBookingsPackagesProvidersDTO, headers);
  }

  postNewBlueReferencePrices(data, headers?:HeadersDTO) {
    return this.packagesNewBlueService.postPackagesNewblueReferencePrices(data, headers);
  }
}
