import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingServicesService } from 'src/management/services/booking-services.service';

@Controller('booking-services')
export class BookingServicesController {
  constructor(private readonly bookingServicesService: BookingServicesService) {}

  @Get(':dossierId')
  @ApiOperation({ summary: 'Obtener booking services de un dossier' })
  @ApiResponse({ status: 200, description: 'Booking services encontrados' })
  create(@Param('dossierId') dossierId: string) {
    return this.bookingServicesService.getBookingServiceById(dossierId);
  }
}
