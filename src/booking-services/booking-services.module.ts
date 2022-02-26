import { Module } from '@nestjs/common';
import { BookingServicesFlightsModule } from './booking-services-flights/booking-services-flights.module';
import { BookingServicesHotelRoomsModule } from './booking-services-hotel-rooms/booking-services-hotel-rooms.module';

@Module({
  imports: [BookingServicesFlightsModule, BookingServicesHotelRoomsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class BookingServicesModule {}
