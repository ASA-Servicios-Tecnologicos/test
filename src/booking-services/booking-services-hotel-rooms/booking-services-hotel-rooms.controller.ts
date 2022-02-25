import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ManagementHttpService } from '../../management/services/management-http.service';
import { CreateHotelBookingRoomDTO } from '../../shared/dto/hotel-booking-room.dto';
import { BookingServicesHotelRoomsService } from './booking-services-hotel-rooms.service';

@Controller('booking-services/hotel-rooms')
export class BookingServicesHotelRoomsController {
  constructor(private readonly bookingServicesHotelRoomsService: BookingServicesHotelRoomsService) {}

  @Post()
  create(@Body() createHotelBookingRoomDTO: CreateHotelBookingRoomDTO) {
    return this.bookingServicesHotelRoomsService.create(createHotelBookingRoomDTO);
  }

  @Delete(':hotelRoomId')
  deleteHotelRoomById(@Param('hotelRoomId') hotelRoomId: string) {
    return this.bookingServicesHotelRoomsService.deleteById(Number(hotelRoomId));
  }

  @Put(':hotelRoomId')
  putHotelRoomById(@Param('hotelRoomId') hotelRoomId: string, @Body() newHotelRoom: CreateHotelBookingRoomDTO) {
    return this.bookingServicesHotelRoomsService.putById(Number(hotelRoomId), newHotelRoom);
  }
}
