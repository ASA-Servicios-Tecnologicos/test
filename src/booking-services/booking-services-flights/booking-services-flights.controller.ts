import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CreateFlightDTO, FlightDTO } from '../../shared/dto/call-center.dto';
import { BookingServicesFlightsService } from './booking-services-flights.service';

@Controller('booking-services/flights')
export class BookingServicesFlightsController {
  constructor(private readonly bookingServicesFlights: BookingServicesFlightsService) {}

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
}
