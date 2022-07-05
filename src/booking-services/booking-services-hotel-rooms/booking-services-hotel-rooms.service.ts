import { Injectable } from '@nestjs/common';
import { AddPassengerHotelRoomDto } from '../../shared/dto/booking-service.dto';
import { HotelBookingRoomsService } from '../../management/services/hotel-booking-rooms.service';
import { CreateHotelBookingRoomDTO, ManagementHotelBookingRoomDTO } from '../../shared/dto/hotel-booking-room.dto';

@Injectable()
export class BookingServicesHotelRoomsService {
  constructor(private readonly hotelBookingRoomsService: HotelBookingRoomsService) { }

  create(createHotelBookingRoomDTO: CreateHotelBookingRoomDTO): Promise<ManagementHotelBookingRoomDTO> {
    return this.hotelBookingRoomsService.createHotelBookingRoom(createHotelBookingRoomDTO);
  }

  deleteById(hotelBookingRoomId: number): Promise<void> {
    return this.hotelBookingRoomsService.deleteHotelBookingRoomById(hotelBookingRoomId);
  }

  putById(hotelBookingRoomId: number, createHotelBookingRoomDTO: CreateHotelBookingRoomDTO): Promise<ManagementHotelBookingRoomDTO> {
    return this.hotelBookingRoomsService.putHotelBookingRoomById(hotelBookingRoomId, createHotelBookingRoomDTO);
  }

  addPassengerToTransfer(body: AddPassengerHotelRoomDto) {
    return this.hotelBookingRoomsService.addPassengerToHotelRoom(body);
  }

  deletePassengerFromTransfer(roomId: string, paxId: string) {
    return this.hotelBookingRoomsService.deletePassengerFromHotelRoom(roomId, paxId);
  }
}
