export class CreateExternalUserDTO {
  accept_privacy_policy?: boolean;
  agency: number;
  agency_chain: number;
  dni: string;
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
