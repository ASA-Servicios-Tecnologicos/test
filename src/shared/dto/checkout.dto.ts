import { CancellationPolicyDTO } from "./booking.dto";

export interface CheckoutDTO {
  booking: BookingDTO;
}

export interface BookingDTO {
  bookingId?: string;
  okURL: string;
  koURL: string;
  totalAmount: number;
  currency: string;
  market: string;
  language: string;
  startDate: string;
  endDate: string;
}
