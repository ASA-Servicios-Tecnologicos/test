import { Body, Controller, Delete, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddPassengerFlightDto } from '../../shared/dto/booking-service.dto';
import { CreateFlightDTO, FlightDTO } from '../../shared/dto/call-center.dto';
import { BookingServicesFlightsService } from './booking-services-flights.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('booking-services/flights')
export class BookingServicesFlightsController {
  constructor(private readonly bookingServicesFlights: BookingServicesFlightsService) { }

  @Post(':flightBookingServiceId/segment')
  createFlight(
    @Param('flightBookingServiceId') flightBookingServiceId: string,
    @Body() createFlightDTO: CreateFlightDTO,
  ): Promise<FlightDTO> {
    return this.bookingServicesFlights.createFlight(Number(flightBookingServiceId), createFlightDTO);
  }

  @Delete('segment/:flightSegmentId')
  deleteFlight(@Param('flightSegmentId') flightSegmentId: string): Promise<void> {
    return this.bookingServicesFlights.deleteFlightSegmentById(Number(flightSegmentId));
  }

  @Put('segment/:flightSegmentId')
  putFlightSegment(@Param('flightSegmentId') flightSegmentId: string, @Body() newFlightSegment: CreateFlightDTO) {
    return this.bookingServicesFlights.putFlightSegment(Number(flightSegmentId), newFlightSegment);
  }

  @Post('passenger')
  @ApiOperation({ summary: 'Añade un pasajero a un vuelo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pasajero añadido al vuelo' })
  addPassengerToFlight(@Body() body: AddPassengerFlightDto) {
    return this.bookingServicesFlights.addPassengerToFlight(body);
  }

  @Delete('passenger/:bookingFlightSegmentId')
  @ApiOperation({ summary: 'Borra un pasajero de un vuelo' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pasajero eliminado del vuelo' })
  deletePassengerFromFlight(@Param('bookingFlightSegmentId') id: string) {
    return this.bookingServicesFlights.deletePassengerFromFlight(id);
  }
}
