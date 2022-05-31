import { Body, Controller, Get, Post, Query, Headers } from '@nestjs/common';
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
export class HeadersDTO {
  'monit-tsid' ?: string;
}

// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('booking-packages')
export class BookingPackagesController {
  constructor(private readonly bookingPackagesService: BookingPackagesService) {}

  @Post('providers/pre-bookings')
  postPreBookingsPackagesProviders(@Body() postPreBookingsPackagesProvidersDTO: PostPreBookingsPackagesProvidersDTO, @Headers() headers?:HeadersDTO): Promise<any> {
    return this.bookingPackagesService.postPrebookingsPackagesProviders(postPreBookingsPackagesProvidersDTO, headers);
  }

  @Post('new-blue/reference-prices')
  getBookingPackagesNewBlue(@Body() data, @Headers() headers?:HeadersDTO) {
    return this.bookingPackagesService.postNewBlueReferencePrices(data, headers);
  }

  @Get('providers')
  getBookingPackagesProviders(@Query() queryParams?: BookingPackagesProvidersFilters, @Headers() headers?:HeadersDTO) {

    return this.bookingPackagesService.getBookingPackagesProviders(queryParams, headers);
  }
}
