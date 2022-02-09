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

export class GetDossiersByClientDTO {
  count: number;
  next?: any;
  previous?: any;
  results: ManagementDossierByAgency[];
}

export class ManagementDossierByAgency {
  id: number;
  code: string;
  total_amount: number;
  total_services: number;
  total_discount: number;
  net_amount: number;
  dossier_status: string;
  dossier_situation: string;
  client_full_name: string;
  active: boolean;
  creation_date: Date;
  created_by: string;
  update_date: Date;
  update_by: string;
  code_agency: number;
  total?: any;
  opening_date: string;
  type: number;
  year: number;
  observation?: any;
  total_amount_without_service: number;
  total_abono_without_service: number;
  sent_to_soap: boolean;
  client: number;
  dossier_budget_status?: any;
  agency: number;
  reference?: any;
  dossier_pax: [];
}
