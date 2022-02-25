export enum BookingRoomRegimen {}

export enum BookingRoomType {}

export class CreateHotelBookingRoomDTO {
  hotel_booking_service: number;
  quantity: number;
  regimen: number;
  room_type: number;
}

export class ManagementHotelBookingRoomDTO {
  id: number;
  pax: Pax[];
  deleted_at?: any;
  active: boolean;
  creation_date: string;
  created_by: string;
  update_date: string;
  update_by: string;
  room_type_text: string;
  regimen_text: string;
  quantity: number;
  checkIn?: any;
  checkOut?: any;
  price?: any;
  cancellation_amount?: any;
  cancellation_from?: any;
  rateId?: any;
  roomId?: any;
  hotel_booking_service: number;
  room_type: number;
  regimen: number;
}

interface Pax {
  id: number;
  deleted_at?: any;
  name: string;
  last_name: string;
  home_phone?: any;
  phone: string;
  dni: string;
  address?: any;
  email: string;
  birthdate?: any;
  active: boolean;
  creation_date: string;
  created_by: string;
  update_date: string;
  update_by: string;
  expiration_document?: any;
  age: number;
  type: string;
  nationality?: any;
  country_of_residence?: any;
  nationality_of_id?: any;
  loyalty_card_company?: any;
  loyalty_card_number?: any;
  person_title?: any;
  type_document?: any;
  gender?: any;
}
