import { Controller } from '@nestjs/common';
import { ManagementHttpService } from '../../management/services/management-http.service';
import { BookingServicesHotelRoomsService } from './booking-services-hotel-rooms.service';

@Controller('booking-services/hotel-rooms')
export class BookingServicesHotelRoomsController {
  constructor(private readonly bookingServicesHotelRoomsService: BookingServicesHotelRoomsService) {}
}
