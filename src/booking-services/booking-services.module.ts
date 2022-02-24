import { Module } from '@nestjs/common';
import { BookingServicesFlightsModule } from './booking-services-flights/booking-services-flights.module';

@Module({
  imports: [BookingServicesFlightsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class BookingServicesModule {}
