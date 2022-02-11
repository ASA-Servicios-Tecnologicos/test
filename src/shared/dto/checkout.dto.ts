import { CancellationPolicyDTO, DistributionDTO } from './booking.dto';

export interface CreateCheckoutDTO {
  booking: CheckoutBookingDTO;
}

export interface CheckoutBookingDTO {
  bookingId: string;
  okURL: string;
  koURL: string;
  amount: CheckoutAmount;
  description: string;
  market: string;
  language: string;
  startDate: string;
  endDate: string;
  cancellationPolicies: Array<CancellationPolicyDTO>;
  distribution: Array<DistributionDTO>;
}

export interface CheckoutDTO {
  checkoutURL: string;
  booking: {
    bookingId: string;
    okURL: string;
    koURL: string;
    backURL: string;
    amount: CheckoutAmount;
    startDate: string;
    endDate: string;
  };
  checkoutId: string;
  passengers: Array<CheckoutPassenger>;
  payment: CheckoutPayment;
  buyer: CheckoutBuyer;
  contact: CheckoutContact;
}

export interface CheckoutPassenger {
  gender: string;
  title: string;
  name: string;
  lastname: string;
  dob: string;
  document: CheckoutDocument;
  country: string;
  room: string;
  age: string;
  extCode: string;
  type: 'ADULT' | 'CHILD';
}

export interface CheckoutDocument {
  documentType: string;
  documentNumber: string;
  expeditionDate: string;
  nationality: string;
}

export interface CheckoutPayment {
  amount: CheckoutAmount;
  installments: Array<CheckoutInstallment>;
  paymentMethods: Array<CheckoutPaymentMethod>;
  methodType: string;
  methodCode: number;
  acceptConditions: boolean;
  defer: boolean;
  creditCard: CheckoutCreditCard;
  buyer: CheckoutBuyer;
}

export interface CheckoutInstallment {
  dueDate: string;
  amount: CheckoutAmount;
  recurrent: boolean;
  status: string;
  orderCode: string;
}

export interface CheckoutAmount {
  value: number;
  currency: string;
}

export interface CheckoutPaymentMethod {
  code: string;
  type: string;
}
export interface CheckoutCreditCard {
  cardHolder: string;
  expiryYear: string;
  expiryMonth: string;
  token: string;
}

export interface CheckoutBuyer {
  gender: string;
  name: string;
  title: string;
  lastname: string;
  dob: string;
  country: string;
  document: CheckoutDocument;
}

export interface CheckoutContact {
  address: CheckoutAddress;
  phone: CheckoutPhone;
  email: string;
  newsletter: boolean;
}

export interface CheckoutAddress {
  address: string;
  city: string;
  postalCode: number;
}

export interface CheckoutPhone {
  phone: number;
  prefix: string;
}
