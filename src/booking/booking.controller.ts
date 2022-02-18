import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingDTO } from '../shared/dto/booking.dto';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}
  @Post()
  @ApiOperation({ summary: 'Crear un booking y obtener un checkout id' })
  @ApiResponse({ status: 201, description: 'Booking creado.' })
  create(@Body() booking: BookingDTO) {
    return this.bookingService.create(booking);
  }

  @Get('bybooking/:bookingId')
  findBookingById(@Param('bookingId') id: string) {
    return this.bookingService.findById(id);
  }

  @Get('book/:bookingId')
  @ApiOperation({
    summary: 'Realizar una reserva y guardarla',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reserva realizada' })
  reserve(@Param('bookingId') bookingId: string) {
    return this.bookingService.doBooking(bookingId);
  }

  @Get('bycheckout/:checkoutId')
  findBookingByCheckoutId(@Param('checkoutId') checkoutId: string) {
    return this.bookingService.getRemoteCheckout(checkoutId);
  }

  @Post('confirm/:id')
  confirmBooking(@Param('id') id: string) {}

  // Jefer datos de booking
  // Jose Angel insertar en management booking
}
