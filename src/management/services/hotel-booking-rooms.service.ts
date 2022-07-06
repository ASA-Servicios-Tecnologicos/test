import { Injectable } from '@nestjs/common';
import { AddPassengerHotelRoomDto } from '../../shared/dto/booking-service.dto';
import { AppConfigService } from '../../configuration/configuration.service';
import { CreateHotelBookingRoomDTO, ManagementHotelBookingRoomDTO } from '../../shared/dto/hotel-booking-room.dto';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class HotelBookingRoomsService {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) { }

  createHotelBookingRoom(createHotelBookingRoomDTO: CreateHotelBookingRoomDTO): Promise<ManagementHotelBookingRoomDTO> {
    return this.managementHttpService.post<ManagementHotelBookingRoomDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/hotel-booking-rooms/`,
      createHotelBookingRoomDTO,
    );
  }

  deleteHotelBookingRoomById(id: number): Promise<void> {
    return this.managementHttpService.delete(`${this.appConfigService.BASE_URL}/management/api/v1/hotel-booking-rooms/${id}/`);
  }

  putHotelBookingRoomById(id: number, createHotelBookingRoomDTO: CreateHotelBookingRoomDTO): Promise<ManagementHotelBookingRoomDTO> {
    return this.managementHttpService.put<ManagementHotelBookingRoomDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/hotel-booking-rooms/${id}/`,
      createHotelBookingRoomDTO,
    );
  }


  addPassengerToHotelRoom(body: AddPassengerHotelRoomDto) {
    return this.managementHttpService.post(`${this.appConfigService.BASE_URL}/management/api/v1/hotel-booking-rooms-pax/`, body);
  }

  deletePassengerFromHotelRoom(roomId: string, paxId: string) {
    return this.managementHttpService.delete(`${this.appConfigService.BASE_URL}/management/api/v1/hotel-booking-rooms-pax/${roomId}/${paxId}/`);
  }
}
