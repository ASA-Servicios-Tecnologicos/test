//TODO: Type data when test this function
export class CallCenterBookingFilterParamsDTO {
  code?: string;
  locator?: string;
  client?: string;
  opening_date_from?: string;
  opening_date_to?: string;
  page?: string;
  dossier_status?: number;
  dossier_situation?: number;
  all_data?: boolean;
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
  services: any;
}
export class CreateUpdateBookingServicePax {
  person_title?: any;
  name?: any;
  last_name?: any;
  birthdate: string;
  phone?: any;
  email?: any;
  type_document?: any;
  dni?: any;
  expiration_document?: any;
  booking_service: number;
  country_of_residence: string;
  gender: string;
  nationality_of_id: string;
  nationality: string;
  loyalty_card_company: string;
  loyalty_card_number: string;
  address: string;
  active: string;
}

export interface Pax {
  id: number;
  deleted_at?: any;
  name: string;
  last_name: string;
  home_phone?: any;
  phone: string;
  dni: string;
  address?: any;
  email: string;
  birthdate: string;
  active: boolean;
  creation_date: string;
  created_by: string;
  update_date: string;
  update_by: string;
  expiration_document: string;
  age?: any;
  type?: any;
  nationality?: any;
  country_of_residence?: any;
  nationality_of_id?: any;
  loyalty_card_company?: any;
  loyalty_card_number?: any;
  person_title?: any;
  type_document: number;
  gender?: any;
}
