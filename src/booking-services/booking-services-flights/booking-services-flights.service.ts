import { Injectable } from '@nestjs/common';
import { BookingServicesService } from '../../management/services/booking-services.service';
import { CreateFlightDTO, FlightDTO } from '../../shared/dto/call-center.dto';

@Injectable()
export class BookingServicesFlightsService {
  constructor(private readonly bookingServicesService: BookingServicesService) {}

  createFlight(flightBookingServiceId: number, createFlightDTO: CreateFlightDTO): Promise<FlightDTO> {
    return this.bookingServicesService.createFlightBookingService(flightBookingServiceId, createFlightDTO);
  }

  deleteFlightSegmentById(flightSegmentId: number): Promise<void> {
    return this.bookingServicesService.deleteFlightSegmentById(flightSegmentId);
  }

  putFlightSegment(flightSegmentId: number, newFlightSegment) {
    return this.bookingServicesService.putFlightSegmentById(flightSegmentId, newFlightSegment);
  }
}
