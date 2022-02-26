interface ManagementSetupDTO {
  type_document: Typedocument[];
  type_document_business: Typedocument[];
  type_document_freelance: Typedocument[];
  client_type: Clienttype[];
  commercial_activities_type: Commercialactivitiestype[];
  dossier_status: Clienttype[];
  commercial_activities_status: Commercialactivitiesstatus[];
  dossier_situation: Clienttype[];
  dossier_group_situation: Dossiergroupsituation[];
  room_type: Clienttype[];
  settlement_type: Clienttype[];
  iva_type: Ivatype[];
  fiscal_location: Clienttype[];
  payment_method: Paymentmethod[];
  economy_info_type: Clienttype[];
  economic_agreement: Clienttype[];
  service: Service[];
  person_title: Persontitle[];
  fee_apply: Feeapply[];
  iva_apply: Clienttype[];
  hotel_regime: Clienttype[];
  hotel_additional_option: Hoteladditionaloption[];
  hotel_input_option: Hoteladditionaloption[];
  hotel_output_option: Hoteladditionaloption[];
  dossier_budget_status: Clienttype[];
  flight_category: Clienttype[];
  cruise_regime: Dossiergroupsituation[];
  cruise_rooms_type: Dossiergroupsituation[];
  roles: Role[];
  categories: Category[];
  method: Method[];
  type: Type[];
  recurrence_type: any[];
  recurrence_days: any[];
  transfer_type: Transfertype[];
  fiscal_country: Fiscalcountry[];
  provider_type: Role[];
  tax_regime: Role[];
  tax_regime_client: Role[];
  type_activity: any[];
  tags: any[];
  dossier_plaza_visibility: Role[];
  prepaid_status: Dossiergroupsituation[];
}

interface Fiscalcountry {
  id: number;
  name: string;
  name_en: string;
}

interface Transfertype {
  id: number;
  active: boolean;
  creation_date: string;
  created_by?: any;
  update_date?: any;
  update_by?: any;
  name: string;
  type: string;
}

interface Type {
  id: number;
  active: boolean;
  creation_date: string;
  created_by: string;
  update_date: string;
  update_by: string;
  name: string;
}

interface Method {
  id: number;
  active: boolean;
  creation_date: string;
  created_by: string;
  update_date: string;
  update_by?: any;
  name: string;
}

interface Category {
  id: number;
  name: string;
  is_category_tag: boolean;
}

interface Role {
  id: number;
  name: string;
}

interface Hoteladditionaloption {
  id: number;
  active: boolean;
  creation_date?: string;
  created_by?: any;
  update_date?: string;
  update_by?: any;
  name: string;
  type?: number;
}

interface Feeapply {
  id: number;
  active: boolean;
  creation_date: string;
  created_by?: string;
  update_date: string;
  update_by?: any;
  name: string;
}

interface Persontitle {
  code: string;
  name: string;
}

interface Service {
  id: number;
  deleted_at?: any;
  active: boolean;
  creation_date: string;
  created_by?: any;
  update_date: string;
  update_by?: any;
  name: string;
  code: string;
  book_description: string;
  is_category_tag: boolean;
  category: number;
}

interface Paymentmethod {
  id: number;
  active: boolean;
  creation_date: string;
  created_by?: string;
  update_date: string;
  update_by?: any;
  name: string;
  accountant_code: string;
  initial_code: number;
}

interface Ivatype {
  id: number;
  active: boolean;
  creation_date: string;
  created_by?: string;
  update_date: string;
  update_by?: any;
  group: number;
  name: string;
  value: number;
}

interface Dossiergroupsituation {
  id: number;
  active: boolean;
  creation_date?: any;
  created_by?: any;
  update_date?: any;
  update_by?: any;
  name: string;
}

interface Commercialactivitiesstatus {
  id: number;
  active: boolean;
  creation_date: string;
  created_by?: string;
  update_date: string;
  update_by?: string;
  name: string;
}

interface Commercialactivitiestype {
  id: number;
  active: boolean;
  creation_date?: string;
  created_by?: any;
  update_date?: string;
  update_by?: any;
  name: string;
  color: string;
}

interface Clienttype {
  id: number;
  active: boolean;
  creation_date: string;
  created_by?: any;
  update_date: string;
  update_by?: any;
  name: string;
}

interface Typedocument {
  id: number;
  active: boolean;
  creation_date: string;
  created_by?: any;
  update_date: string;
  update_by?: any;
  name: string;
  type: number;
}
