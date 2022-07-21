import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NumericDictionary } from 'lodash';

export class ManagementClientDTO {
  @ApiProperty({ example: 822 })
  id: number;

  @ApiProperty({ example: '43000000822' })
  code: string;

  @ApiProperty({ example: 4 })
  number_dossier: number;

  @ApiProperty({ example: 2022 })
  billing_period: number;

  @ApiProperty({ example: 4 })
  number_services: number;

  @ApiProperty({ example: '0.00' })
  benefit: string;

  @ApiProperty({ example: 'Prueba Prueba' })
  final_name: string;

  @ApiProperty({ example: 'Perez' })
  surname?: string;

  @ApiProperty({ example: new Date('2022-01-27T10:59:50.469066') })
  last_order: Date;

  @ApiProperty({ example: 'Prueba' })
  last_name: string;

  @ApiPropertyOptional({ example: null })
  home_phone?: any;

  @ApiProperty({ example: '666555444' })
  phone: string;

  @ApiProperty({ example: '16891861' })
  dni: string;

  @ApiPropertyOptional({ example: null })
  address?: any;

  @ApiProperty({ example: 'a@b.com' })
  email: string;

  @ApiPropertyOptional({ example: null })
  birthdate?: any;

  @ApiProperty({ example: true })
  active: boolean;

  @ApiProperty({ example: '2022-01-25T14:32:58.319397' })
  creation_date: Date;

  @ApiProperty({ example: 'flowodev' })
  created_by: string;

  @ApiProperty({ example: '2022-01-25T14:32:58.319397' })
  update_date: Date;

  @ApiProperty({ example: 'flowodev' })
  update_by: string;

  @ApiProperty({ example: 'prueba' })
  name: string;

  @ApiProperty({ example: null })
  business_name?: any;

  @ApiProperty({ example: '43000000822' })
  accountant_account: string;

  @ApiPropertyOptional({ example: null })
  country?: any;

  @ApiProperty({ example: null })
  province?: any;

  @ApiProperty({ example: null })
  locality?: any;

  @ApiProperty({ example: null })
  phone2?: any;

  @ApiProperty({ example: null })
  down_notification?: any;

  @ApiProperty({ example: null })
  code_app?: any;

  @ApiProperty({ example: null })
  points?: any;

  @ApiProperty({ example: null })
  observation?: any;

  @ApiProperty({ example: null })
  permit_email?: any;

  @ApiPropertyOptional({ example: null })
  catalog_client?: any;

  @ApiPropertyOptional({ example: null })
  postal_code?: any;

  @ApiProperty({ example: 'ES' })
  nationality: string;

  @ApiPropertyOptional({ example: null })
  city?: any;

  @ApiPropertyOptional({ example: null })
  accept_privacy_policy?: any;

  @ApiPropertyOptional({ example: null })
  rgpd_policity?: any;

  @ApiPropertyOptional({ example: null })
  data_transfer?: any;

  @ApiPropertyOptional({ example: null })
  image_transfer?: any;

  @ApiProperty({ example: false })
  model_347: boolean;

  @ApiProperty({ example: false })
  roi_enrolled: boolean;

  @ApiProperty({ example: 288 })
  agency_chain: number;

  @ApiProperty({ example: 633 })
  agency: number;

  @ApiPropertyOptional({ example: null })
  type_document?: any;

  @ApiProperty({ example: 1 })
  client_type: number;

  @ApiPropertyOptional({ example: null })
  fiscal_country?: any;

  @ApiPropertyOptional({ example: null })
  fiscal_location?: any;

  @ApiProperty({ example: [] })
  tags: [];
}

export class GetManagementClientInfoByUsernameDTO {
  id: number;
  name: string;
  last_name: string;
  business_name: string;
  dni: string;
  phone: string;
  email: string;
  user_id: number;
  client_username: string;
}

export interface IntegrationClientDTO {
  id: number;
  role: {
    id: number;
    name: string;
  };
  agency_chain: {
    id: number;
    name: string;
  };
  agency: {
    id: number;
    name: string;
    agency_chain_id: number;
  };
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  logo: null;
  client: null;
}

export interface ClientRequestPatchDTO {
  id: number;
  address?: string;
  country?: string;
  province?: string;
  postal_code?: string;

  dni?: string;
  type_document?: number;
}

export enum TypeDocument {
  'DNI' = 'DNI',
  'NIE' = 'NIE',
}
