import { Module } from '@nestjs/common';
import { ManagementModule } from 'src/management/management.module';
import { BookingServicesFlightsModule } from './booking-services-flights/booking-services-flights.module';
import { BookingServicesHotelRoomsModule } from './booking-services-hotel-rooms/booking-services-hotel-rooms.module';
import { BookingServicesController } from './booking-services.controller';

@Module({
  imports: [BookingServicesFlightsModule, BookingServicesHotelRoomsModule, ManagementModule],
  controllers: [BookingServicesController],
  providers: [],
  exports: [],
})
export class BookingServicesModule {}
