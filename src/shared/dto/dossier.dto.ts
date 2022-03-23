import { ApiProperty } from '@nestjs/swagger';
import { ManagementBookingServiceDTO } from './booking-service.dto';
import { ManagementClientDTO } from './management-client.dto';

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


export class DossierDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  dossier_pax: [];
  @ApiProperty()
  code: string;
  @ApiProperty()
  total_amount: number;
  @ApiProperty()
  total_abono: number;
  @ApiProperty()
  total_services: number;
  @ApiProperty()
  total_discount: number;
  @ApiProperty()
  net_amount: number;
  @ApiProperty()
  total_charged: number;
  @ApiProperty()
  total_payments: number;
  @ApiProperty()
  total_fees: number;
  @ApiProperty()
  pending_charged: number;
  @ApiProperty()
  pending_payment: number;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  creation_date: Date;
  @ApiProperty()
  created_by: string;
  @ApiProperty()
  update_date: Date;
  @ApiProperty()
  update_by: string;
  @ApiProperty()
  code_agency: number;
  @ApiProperty({ example: null })
  total?: any;
  @ApiProperty()
  opening_date: string;
  @ApiProperty()
  type: number;
  @ApiProperty()
  year: number;
  @ApiProperty({ example: null })
  observation?: any;
  @ApiProperty()
  total_amount_without_service: number;
  @ApiProperty()
  total_abono_without_service: number;
  @ApiProperty()
  sent_to_sap: boolean;
  @ApiProperty()
  client: ManagementClientDTO;
  @ApiProperty({ example: null })
  dossier_status?: any;
  @ApiProperty()
  dossier_budget_status: number;
  @ApiProperty({ example: null })
  dossier_situation?: any;
  @ApiProperty()
  agency: number;
  @ApiProperty({ example: null })
  reference?: any;
  @ApiProperty()
  pax_reserves: number;
  @ApiProperty()
  services: ManagementBookingServiceDTO[];
  @ApiProperty()
  dossier_payments?: Array<any>;
}