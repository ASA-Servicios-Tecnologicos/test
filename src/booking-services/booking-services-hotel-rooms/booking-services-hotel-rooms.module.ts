import { Module } from '@nestjs/common';
import { ManagementModule } from '../../management/management.module';
import { BookingServicesHotelRoomsController } from './booking-services-hotel-rooms.controller';
import { BookingServicesHotelRoomsService } from './booking-services-hotel-rooms.service';

@Module({
  imports: [ManagementModule],
  controllers: [BookingServicesHotelRoomsController],
  providers: [BookingServicesHotelRoomsService],
  exports: [BookingServicesHotelRoomsService],
})
export class BookingServicesHotelRoomsModule {}
