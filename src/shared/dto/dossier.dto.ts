import { ManagementBookingServiceDTO } from './booking-service.dto';

export class ManagementDossierDto {
  code: string;
  observation?: any;
  dossier_status: string;
  dossier_situation: string;
  opening_date: Date;
  booking_services: ManagementBookingServiceDTO[];
}

export class GetManagementDossiersByClientId {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  reservations: ManagementDossierDto[];
  budgets: ManagementDossierDto[];
}
