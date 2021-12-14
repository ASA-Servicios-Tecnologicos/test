import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookingDTO } from '../shared/dto/booking.dto';

@Controller('booking')
export class BookingController {
  @Post()
  create(@Body() booking: BookingDTO) {}

  @Get('byid/:id')
  findBookingById(@Param('id') id: string) {}

  @Get('bycheckout/:checkoutId')
  findBookingByCheckoutId(@Param('checkoutId') checkoutId: string) {}

  @Post('confirm/:id')
  confirmBooking(@Param('id') id: string) {}
}
