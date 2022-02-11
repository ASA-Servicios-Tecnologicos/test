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
  checkoutId: string;
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
  passengers: Array<CheckoutPassenger>;
  payment: {
    methodType: any;
    creditCardDto: any;
    defer: boolean;
    status: any;
    amount: CheckoutAmount;
    redirectionUrl: any;
    installmentList: Array<CheckoutInstallment>;
  };
  buyer: CheckoutBuyer;
  contact: CheckoutContact;
}

export interface CheckoutPassenger {
  room: string;
  age: string;
  extCode: string;
  type: 'ADULT' | 'CHILD';
  gender: string;
  title: string;
  name: string;
  lastname: string;
  dob: string;
  country: string;
  document: CheckoutDocument;
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
  buyer;
}

export interface CheckoutInstallment {
  dueDate: string;
  amount: CheckoutAmount;
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
  title: string;
  name: string;
  lastname: string;
  dob: string;
  country: string;
  document: CheckoutDocument;
}

export interface CheckoutContact {
  address: CheckoutAddress;
  phone: CheckoutPhone;
  email: string;
  newsletter: string;
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
