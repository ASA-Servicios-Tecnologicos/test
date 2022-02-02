//TODO: Type data when test this function
export class CallCenterBookingFilterParamsPaymentDTO {
  payment: any;
  paymentType: any;
  paymentStatus: any;
}
export class CallCenterBookingFilterParamsProviderDTO {
  providerStatus: any;
}
export class CallCenterBookingFilterParamsDateDTO {
  bookingDateStart: any;
  bookingDateEnd: any;
}
export class CallCenterBookingFilterParamsReferenceDTO {
  internalRef: any;
  providerRef: any;
  name: any;
}
export class CallCenterBookingFilterParamsDTO {
  reference?: CallCenterBookingFilterParamsReferenceDTO;
  date?: CallCenterBookingFilterParamsDateDTO;
  provider?: CallCenterBookingFilterParamsProviderDTO;
  payment?: CallCenterBookingFilterParamsPaymentDTO;
}
