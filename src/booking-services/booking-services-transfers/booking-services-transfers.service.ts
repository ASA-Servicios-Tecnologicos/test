import { Injectable } from '@nestjs/common';
import { AddPassengerTransferDto } from 'src/shared/dto/booking-service.dto';
import { BookingServicesService } from '../../management/services/booking-services.service';
import { CreateTransferDTO, TransferDTO } from '../../shared/dto/call-center.dto';

@Injectable()
export class BookingServicesTransfersService {
  constructor(private readonly bookingServicesService: BookingServicesService) { }

  createTransfer(transferBookingServiceId: number, createTransferDTO: CreateTransferDTO): Promise<TransferDTO> {
    return this.bookingServicesService.createTransferBookingService(transferBookingServiceId, createTransferDTO);
  }

  deleteTransferSegmentById(transferSegmentId: number): Promise<void> {
    return this.bookingServicesService.deleteTransferSegmentById(transferSegmentId);
  }

  putTransferSegment(transferSegmentId: number, newTransferSegment: Partial<CreateTransferDTO>) {
    return this.bookingServicesService.putTransferSegmentById(transferSegmentId, newTransferSegment);
  }

  addPassengerToTransfer(body: AddPassengerTransferDto) {
    return this.bookingServicesService.addPassengerToTransfer(body);
  }

  deletePassengerFromTransfer(id: string) {
    return this.bookingServicesService.deletePassengerFromTransfer(id);
  }
}
