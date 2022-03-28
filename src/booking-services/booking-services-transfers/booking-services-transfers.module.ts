import { Module } from '@nestjs/common';
import { ManagementModule } from '../../management/management.module';
import { BookingServicesTransfersController } from './booking-services-transfers.controller';
import { BookingServicesTransfersService } from './booking-services-transfers.service';

@Module({
  imports: [ManagementModule],
  controllers: [BookingServicesTransfersController],
  providers: [BookingServicesTransfersService],
  exports: [BookingServicesTransfersService],
})
export class BookingServicesFlightsModule { }
