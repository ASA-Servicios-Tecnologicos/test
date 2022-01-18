import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingDTO } from '../shared/dto/booking.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un booking y obtener un checkout id' })
  @ApiResponse({ status: 201, description: 'Booking creado.'})
  create(@Body() booking: BookingDTO) {
    return this.bookingService.create(booking);
  }

  @Get('bybooking/:bookingId')
  findBookingById(@Param('bookingId') id: string) {
    return this.bookingService.findById(id);
  }

  @Get('bycheckout/:checkoutId')
  findBookingByCheckoutId(@Param('checkoutId') checkoutId: string) {}

  @Post('confirm/:id')
  confirmBooking(@Param('id') id: string) {}

  // Jefer datos de booking
  // Jose Angel insertar en management booking
}
