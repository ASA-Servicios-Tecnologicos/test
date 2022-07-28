import { HeadersDTO } from './../shared/dto/header.dto';
import { Body, Controller, Get, Headers, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingDTO } from '../shared/dto/booking.dto';
import { BookingService } from './booking.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
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
  @ApiOperation({ summary: 'Obtiene los infoRequirements por el bookingId' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 409, description: 'Not found bookingId' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findBookingById(@Param('bookingId') id: string) {
    return this.bookingService.findById(id);
  }

  @Get('book/:bookingId')
  @ApiOperation({
    summary: 'Realizar una reserva y guardarla',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reserva realizada' })
  reserve(@Param('bookingId') bookingId: string, @Headers() headers?: HeadersDTO) {
    return this.bookingService.doBooking(bookingId, headers);
  }

  @Get('bycheckout/:checkoutId')
  findBookingByCheckoutId(@Param('checkoutId') checkoutId: string) {
    return this.bookingService.getRemoteCheckout(checkoutId);
  }
}
