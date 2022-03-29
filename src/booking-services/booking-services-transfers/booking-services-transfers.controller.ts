import { Body, Controller, Delete, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddPassengerFlightDto, AddPassengerTransferDto } from 'src/shared/dto/booking-service.dto';
import { CreateFlightDTO, CreateTransferDTO, FlightDTO, TransferDTO } from '../../shared/dto/call-center.dto';
import { BookingServicesTransfersService } from './booking-services-transfers.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('booking-services/transfers')
export class BookingServicesTransfersController {
  constructor(private readonly bookingServicesTransfers: BookingServicesTransfersService) { }

  @Post(':bookingTransferSegmentId/segment')
  createFlight(
    @Param('bookingTransferSegmentId') bookingTransferSegmentId: string,
    @Body() createTransferDTO: CreateTransferDTO,
  ): Promise<TransferDTO> {
    return this.bookingServicesTransfers.createTransfer(Number(bookingTransferSegmentId), createTransferDTO);
  }

  @Delete('segment/:transferSegmentId')
  deleteFlight(@Param('transferSegmentId') transferSegmentId: string): Promise<void> {
    return this.bookingServicesTransfers.deleteTransferSegmentById(Number(transferSegmentId));
  }

  @Put('segment/:transferSegmentId')
  putFlightSegment(@Param('transferSegmentId') transferSegmentId: string, @Body() newFlightSegment: CreateFlightDTO) {
    return this.bookingServicesTransfers.putTransferSegment(Number(transferSegmentId), newFlightSegment);
  }

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
