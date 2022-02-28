import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PostPreBookingsPackagesProvidersDTO, PreBookingsPackagesProvidersResponseDTO } from '../shared/dto/booking-packages.dto';
import { BookingPackagesService } from './booking-packages.service';

export class BookingPackagesProvidersFilters {
  origin: string;
  checkIn: string;
  distribution: string;
  nights: string;
  productCode: string;
  destination: String;
  page: number;
  pageSize: string;
  destinationType: string;
  providers: string;
}
// TODO: PENDING TYPE ALL
@Controller('booking-packages')
export class BookingPackagesController {
  constructor(private readonly bookingPackagesService: BookingPackagesService) {}

  @Post('providers/pre-bookings')
  postPreBookingsPackagesProviders(@Body() postPreBookingsPackagesProvidersDTO: PostPreBookingsPackagesProvidersDTO): Promise<any> {
    return this.bookingPackagesService.postPrebookingsPackagesProviders(postPreBookingsPackagesProvidersDTO);
  }

  @Post('new-blue/reference-prices')
  getBookingPackagesNewBlue(@Body() data) {
    return this.bookingPackagesService.postNewBlueReferencePrices(data);
  }

  @Get('providers')
  getBookingPackagesProviders(@Query() queryParams?: BookingPackagesProvidersFilters) {
    return this.bookingPackagesService.getBookingPackagesProviders(queryParams);
  }
}
