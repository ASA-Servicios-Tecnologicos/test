import { CancellationPolicyDTO, DistributionDTO } from './booking.dto';

export interface CheckoutDTO {
  booking: BookingDTO;
}

export interface CheckoutResponseDTO {
  booking: {
    bookingId: string;
    okURL: string;
    koURL: string;
    backURL: string;
    amount: {
      value: number;
      currency: string;
    };
    startDate: string;
    endDate: string;
  };
  checkoutId: string;
  passengers: Array<any>;
  buyer: any;
  contact: any;
  payment: {
    methodType: any;
    creditCardDto: any;
    defer: boolean;
    status: any;
    amount: {
      value: number;
      currency: string;
    };
    redirectionUrl: any;
    installmentList: Array<Installment>;
  };
  checkoutURL: string;
}

export interface Installment {
  dueDate: string;
  amount: {
    value: number;
    currency: string;
  };
  recurrent: any;
  status: any;
}

export interface BookingDTO {
  bookingId: string;
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
