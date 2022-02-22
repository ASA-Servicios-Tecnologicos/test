import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostPreBookingsPackagesProvidersDTO, PreBookingsPackagesProvidersResponseDTO } from '../shared/dto/booking-packages.dto';
import { BookingPackagesService } from './booking-packages.service';

@Controller('booking-packages')
export class BookingPackagesController {
  constructor(private readonly bookingPackagesService: BookingPackagesService) {}

  @Post('providers/pre-bookings')
  postPreBookingsPackagesProviders(@Body() data: PostPreBookingsPackagesProvidersDTO): Promise<PreBookingsPackagesProvidersResponseDTO> {
    return this.bookingPackagesService.postPrebookingsPackagesProviders(data);
  }

  @Get('providers')
  getBookingPackagesProviders() {
    return this.bookingPackagesService.getBookingPackagesProviders();
  }

  @Get('new-blue')
  getBookingPackagesNewBlue() {
    return this.bookingPackagesService.getBookingPackagesNewBlue();
  }
}
