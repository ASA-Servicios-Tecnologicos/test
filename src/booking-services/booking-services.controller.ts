import { HeadersDTO } from './../shared/dto/header.dto';
import { Controller, Get, Param, Query, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingServicesService } from 'src/management/services/booking-services.service';

@Controller('booking-services')
export class BookingServicesController {
  constructor(private readonly bookingServicesService: BookingServicesService) { }

  @Get(':bookingServiceId')
  @ApiOperation({ summary: 'Obtener booking services de un dossier' })
  @ApiResponse({ status: 200, description: 'Booking services encontrados' })
  create(@Param('bookingServiceId') bookingServiceId: string, @Query('force') force: string, @Headers() headers?: HeadersDTO) {
    return this.bookingServicesService.getBookingServiceById(bookingServiceId, force, headers);
  }
}
