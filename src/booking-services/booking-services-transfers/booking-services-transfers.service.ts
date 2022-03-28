import { Injectable } from '@nestjs/common';
import { AddPassengerFlightDto, AddPassengerTransferDto } from 'src/shared/dto/booking-service.dto';
import { BookingServicesService } from '../../management/services/booking-services.service';
import { CreateFlightDTO, FlightDTO } from '../../shared/dto/call-center.dto';

@Injectable()
export class BookingServicesTransfersService {
  constructor(private readonly bookingServicesService: BookingServicesService) { }

  /* createTransfer(flightBookingServiceId: number, createFlightDTO: CreateFlightDTO): Promise<FlightDTO> {
    return this.bookingServicesService.createFlightBookingService(flightBookingServiceId, createFlightDTO);
  }

  deleteTransferSegmentById(flightSegmentId: number): Promise<void> {
    return this.bookingServicesService.deleteFlightSegmentById(flightSegmentId);
  }

  putTransferSegment(flightSegmentId: number, newFlightSegment) {
    return this.bookingServicesService.putFlightSegmentById(flightSegmentId, newFlightSegment);
  } */

  addPassengerToTransfer(body: AddPassengerTransferDto) {
    return this.bookingServicesService.addPassengerToTransfer(body);
  }

  deletePassengerFromTransfer(id: string) {
    return this.bookingServicesService.deletePassengerFromTransfer(id);
  }
}
