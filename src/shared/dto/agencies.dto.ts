export class ManagementProviderDTO {
  accountant_account: string;
  active: boolean;
  address?: any;
  agency_is_provider?: any;
  agency_title?: any;
  alias?: any;
  bank?: any;
  bank_account?: any;
  business_name: string;
  categories: [];
  country: string;
  created_by: string;
  creation_date: Date;
  deleted_at?: any;
  email?: any;
  emergency_phone?: any;
  fiscal_country: number;
  fiscal_location?: any;
  id: number;
  is_commissionable: boolean;
  is_confirmed: boolean;
  is_favorite?: boolean;
  is_has_not_credentials?: any;
  is_integrated: boolean;
  is_multilogin?: boolean;
  is_tecnoworld?: boolean;
  locality?: any;
  logo?: any;
  method?: any;
  model_347?: any;
  name: string;
  nif: string;
  observations?: any;
  payment_method?: any;
  phone?: any;
  postal_code?: any;
  prefix?: any;
  provider_type: number;
  province?: any;
  roi_enrolled?: any;
  services: number[];
  settlement_type?: any;
  swift?: any;
  tax_regime: number;
  update_by: string;
  update_date: Date;
  url_multilogin?: any;
  vat?: any;
  web_page?: any;
}

export class ManagementAgencyProviderById {
  agency: number;
  id: number;
  provider: number;
}
