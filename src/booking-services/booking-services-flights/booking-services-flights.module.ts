import { Module } from '@nestjs/common';
import { ManagementModule } from '../../management/management.module';
import { BookingServicesFlightsController } from './booking-services-flights.controller';
import { BookingServicesFlightsService } from './booking-services-flights.service';

@Module({
  imports: [ManagementModule],
  controllers: [BookingServicesFlightsController],
  providers: [BookingServicesFlightsService],
  exports: [BookingServicesFlightsService],
})
export class BookingServicesFlightsModule {}
