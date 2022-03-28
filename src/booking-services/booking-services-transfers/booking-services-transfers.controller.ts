import { Body, Controller, Delete, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddPassengerFlightDto, AddPassengerTransferDto } from 'src/shared/dto/booking-service.dto';
import { CreateFlightDTO, FlightDTO } from '../../shared/dto/call-center.dto';
import { BookingServicesTransfersService } from './booking-services-transfers.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('booking-services/transfers')
export class BookingServicesTransfersController {
  constructor(private readonly bookingServicesTransfers: BookingServicesTransfersService) { }

  /* @Post(':flightBookingServiceId/segment')
  createFlight(
    @Param('flightBookingServiceId') flightBookingServiceId: string,
    @Body() createFlightDTO: CreateFlightDTO,
  ): Promise<FlightDTO> {
    return this.bookingServicesTransfers.createFlight(Number(flightBookingServiceId), createFlightDTO);
  }

  @Delete('segment/:flightSegmentId')
  deleteFlight(@Param('flightSegmentId') flightSegmentId: string): Promise<void> {
    return this.bookingServicesTransfers.deleteFlightSegmentById(Number(flightSegmentId));
  }

  @Put('segment/:flightSegmentId')
  putFlightSegment(@Param('flightSegmentId') flightSegmentId: string, @Body() newFlightSegment: CreateFlightDTO) {
    return this.bookingServicesTransfers.putFlightSegment(Number(flightSegmentId), newFlightSegment);
  } */

  @Post('passenger')
  @ApiOperation({ summary: 'Añade un pasajero a un traslado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pasajero añadido al traslado' })
  addPassengerToFlight(@Body() body: AddPassengerTransferDto) {
    return this.bookingServicesTransfers.addPassengerToTransfer(body);
  }

  @Delete('passenger/:bookingTransferSegmentId')
  @ApiOperation({ summary: 'Borra un pasajero de un traslado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pasajero eliminado del traslado' })
  deletePassengerFromFlight(@Param('bookingTransferSegmentId') id: string) {
    return this.bookingServicesTransfers.deletePassengerFromTransfer(id);
  }
}
