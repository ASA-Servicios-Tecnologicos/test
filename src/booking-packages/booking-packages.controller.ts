import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostPreBookingsPackagesProvidersDTO, PreBookingsPackagesProvidersResponseDTO } from '../shared/dto/booking-packages.dto';
import { BookingPackagesService } from './booking-packages.service';

@Controller('booking-packages')
export class BookingPackagesController {
  constructor(private readonly bookingPackagesService: BookingPackagesService) {}

  @Post('providers/pre-bookings')
  postPreBookingsPackagesProviders(
    @Body() postPreBookingsPackagesProvidersDTO: PostPreBookingsPackagesProvidersDTO,
  ): Promise<PreBookingsPackagesProvidersResponseDTO> {
    console.log('providers prebooking');
    return this.bookingPackagesService.postPrebookingsPackagesProviders(postPreBookingsPackagesProvidersDTO);
  }

  @Post('new-blue/reference-prices')
  getBookingPackagesNewBlue(@Body() data) {
    console.log('new blue');
    return this.bookingPackagesService.postNewBlueReferencePrices(data);
  }

  @Get('providers')
  getBookingPackagesProviders() {
    console.log('topy here');
    return this.bookingPackagesService.getBookingPackagesProviders();
  }
}
