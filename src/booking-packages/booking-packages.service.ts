import { Injectable } from '@nestjs/common';
import { PackagesNewblueService } from '../management/services/packages-newblue.service';
import { PackagesProvidersService } from '../management/services/packages-providers.service';
import { PostPreBookingsPackagesProvidersDTO, PreBookingsPackagesProvidersResponseDTO } from '../shared/dto/booking-packages.dto';

@Injectable()
export class BookingPackagesService {
  constructor(
    private readonly packagesNewBlueService: PackagesNewblueService,
    private readonly packagesProvidersService: PackagesProvidersService,
  ) {}

  getBookingPackagesProviders() {
    return this.packagesProvidersService.getPackageProviders();
  }

  postPrebookingsPackagesProviders(data: PostPreBookingsPackagesProvidersDTO): Promise<PreBookingsPackagesProvidersResponseDTO> {
    return this.packagesProvidersService.postPreBookings(data);
  }

  getBookingPackagesNewBlue() {
    return this.packagesNewBlueService.getPackagesNewBlue();
  }
}
