import { CancellationPolicyDTO, DistributionDTO } from "./booking.dto";

export interface CheckoutDTO {
  booking: BookingDTO;
}

export interface BookingDTO {
  bookingId?: string;
  okURL: string;
  koURL: string;
  amount: {
    value: number;
    currency: string;
  };
  description: string;
  market: string;
  language: string;
  startDate: string;
  endDate: string;
  cancellationPolicies: Array<CancellationPolicyDTO>;
  distribution: Array<DistributionDTO>;
}
