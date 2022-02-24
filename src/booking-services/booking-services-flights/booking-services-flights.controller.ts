import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateFlightDTO, FlightDTO } from '../../shared/dto/call-center.dto';
import { BookingServicesFlightsService } from './booking-services-flights.service';

@Controller('booking-services/flights')
export class BookingServicesFlightsController {
  constructor(private readonly bookingServicesFlights: BookingServicesFlightsService) {}

  @Post(':flightBookingServiceId')
  createFlight(
    @Param('flightBookingServiceId') flightBookingServiceId: string,
    @Body() createFlightDTO: CreateFlightDTO,
  ): Promise<FlightDTO> {
    return this.bookingServicesFlights.createFlight(Number(flightBookingServiceId), createFlightDTO);
  }

  @Delete(':flightSegmentId')
  deleteFlight(@Param('flightSegmentId') flightSegmentId: string): Promise<void> {
    return this.bookingServicesFlights.deleteFlightSegmentById(Number(flightSegmentId));
  }
}
