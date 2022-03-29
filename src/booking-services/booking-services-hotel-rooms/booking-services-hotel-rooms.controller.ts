import { Body, Controller, Delete, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddPassengerHotelRoomDto } from 'src/shared/dto/booking-service.dto';
import { CreateHotelBookingRoomDTO } from '../../shared/dto/hotel-booking-room.dto';
import { BookingServicesHotelRoomsService } from './booking-services-hotel-rooms.service';
// TODO: Pending ADD  Swagger Document endpoints and request payload validators
@Controller('booking-services/hotel-rooms')
export class BookingServicesHotelRoomsController {
  constructor(private readonly bookingServicesHotelRoomsService: BookingServicesHotelRoomsService) { }

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

  @Post('passenger')
  @ApiOperation({ summary: 'Añade un pasajero a una habitación' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pasajero añadido a la habitación' })
  addPassengerToFlight(@Body() body: AddPassengerHotelRoomDto) {
    return this.bookingServicesHotelRoomsService.addPassengerToTransfer(body);
  }

  @Delete('passenger/:roomId/:paxId')
  @ApiOperation({ summary: 'Borra un pasajero de una habitación' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Pasajero eliminado de la habitación' })
  deletePassengerFromFlight(@Param('roomId') roomId: string, @Param('paxId') paxId: string) {
    return this.bookingServicesHotelRoomsService.deletePassengerFromTransfer(roomId, paxId);
  }
}
