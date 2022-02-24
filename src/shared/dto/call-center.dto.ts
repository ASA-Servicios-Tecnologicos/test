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

export class CreateFlightDTO {
  flight_number: string;
  departure: string;
  arrival: string;
  departure_at: Date;
  arrival_at: Date;
  airline: string;
  flight_booking_service: number;
}
export class FlightDTO {
  id: number;
  flight_booking_service: number;
  flight_number: string;
  segment_number: number;
  departure: string;
  arrival: string;
  departure_at: string;
  arrival_at: string;
  airline: string;
}
