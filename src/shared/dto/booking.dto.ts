import { BookingStatusEnum } from '../enum/booking-status.enum';

export interface BookingDTO {
  id: string;
  checkoutId: string;
  programId: string;
  productId: string;
  checkIn: Date;
  checkOut: Date;
  status: BookingStatusEnum;
  distribution: Room[];
  prebookingToken: string;
  amount: string;
  market: string;
  language: string;
  currency: string;
  session: string;
}

export interface Room {
  pax: Pax[];
}

export interface Pax {
  age: string;
}
