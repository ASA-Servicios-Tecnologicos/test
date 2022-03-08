export class CreateExternalUserDTO {
  accept_privacy_policy?: boolean;
  agency: number;
  agency_chain: number;
  dni?: string;
  email: string;
  first_name: string;
  last_name: string;
  password1: string = '';
  password2: string = '';
  phone: string;
  username: string;
  active: boolean;
  /* Role equal to 8 means cliente-usuario */
  role: number = 8;
}

export interface ExternalUserDTO {
  id: number;
  role: number;
  active: true;
  username: string;
  last_login: string;
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  creation_date: string;
  created_by: any;
  update_date: string;
  update_by: any;
  logo: any;
  is_microsite: boolean;
  agency: number;
  agency_chain: number;
  client: number;
  groups: [];
  user_permissions: [];
}

export interface PatchExternalClient {
  id: number;
  code: string;
  number_dossier: number;
  billing_period: number;
  number_services: number;
  benefit: string;
  final_name: string;
  last_order?: any;
  deleted_at?: any;
  last_name: string;
  home_phone?: any;
  phone: string;
  dni: string;
  address?: any;
  email: string;
  birthdate?: any;
  active: boolean;
  creation_date: string;
  created_by?: any;
  update_date: string;
  update_by: string;
  name: string;
  business_name?: any;
  accountant_account: string;
  country?: any;
  province?: any;
  locality?: any;
  phone2?: any;
  down_notification?: any;
  code_app?: any;
  points?: any;
  observation?: any;
  permit_email?: any;
  catalog_client?: any;
  postal_code?: any;
  nationality?: any;
  city?: any;
  accept_privacy_policy: string;
  rgpd_policity?: any;
  data_transfer?: any;
  image_transfer?: any;
  model_347: boolean;
  roi_enrolled: boolean;
  agency_chain: number;
  agency: number;
  type_document?: any;
  client_type: number;
  fiscal_country?: any;
  fiscal_location?: any;
  tags: any[];
}
