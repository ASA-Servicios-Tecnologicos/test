import { Pax } from './call-center.dto';

export class ManagementBookingServicesByDossierDTO {
  id: number;
  service: {
    id: number;
    name: string;
    is_category_tag: boolean;
  };
  provider: {
    id: number;
    name: string;
    nif: string;
    is_integrated: boolean;
    is_commisionable: boolean;
    tax_regime?: any;
    vat?: any;
    bank?: any;
    switf?: any;
  };
  locator?: any;
  total_pvp: number;
  total_net: number;
  total_abono: number;
  comission: number;
  discount?: any;
  iva_type?: any;
  iva: number;
  fee_apply: number;
  has_invoice: boolean;
  has_supplier_invoice: boolean;
  children: [];
  is_parent_group: boolean;
  fee: number;
  can_cancel: boolean;
  status: string;
  price_from_provider: number;
  creation_date: string;
  profit?: any;
  profit_gross?: any;
  has_payment?: boolean;
  total_payment_to_provider: number;
  tax_regime_to_do_the_invoice: number;
  type_activity?: any;
  can_prepaid: boolean;
}
export class ManagementBookingServiceDTO {
  id: number;
  code: string;
  provider_status: string;
  dossier: {
    id: number;
    code: string;
    observation?: any;
    type: number;
  };
  service: {
    id: number;
    name: string;
    is_category_tag: boolean;
  };
  description: string;
  confirmed_by: string;
  locator: string;
  confirmed_date?: any;
  fiscal_location?: any;
  observation?: any;
  provider: number;
  payment_method?: any;
  payday_limit?: any;
  product_type?: any;
  fee_apply: number;
  fee: number;
  comission: number;
  iva_type?: any;
  iva: number;
  pvp_fee: number;
  not_fee_amount: number;
  discount?: any;
  total_net: number;
  total_pvp: number;
  profit_gross?: any;
  profit?: any;
  hotels: [
    {
      id: number;
      hotel_rooms: [
        {
          id: number;
          pax: [];
          active: boolean;
          creation_date: Date;
          created_by: string;
          update_date: Date;
          update_by: string;
          room_type_text: string;
          regimen_text: string;
          quantity: number;
          checkIn?: any;
          checkOut?: any;
          price?: any;
          cancelattion_amount?: any;
          cancelattion_from?: any;
          rateId?: any;
          roomId?: any;
          hotel_booking_service: number;
          room_type?: any;
          regimen?: any;
        },
      ];
      active: boolean;
      creation_date: Date;
      created_by: string;
      update_date: Date;
      update_by: string;
      check_in: string;
      check_out: string;
      cancellation_to: string;
      cancellation_amount: number;
      observation?: any;
      name: string;
      address: string;
      postal_code?: any;
      raw_data: any;
    },
  ];
  flight: Array<any>;
  transfer: Array<any>;
  safes: Array<any>;
  cars: Array<any>;
  circuits: Array<any>;
  train: Array<any>;
  tickets: Array<any>;
  activity: Array<any>;
  paxes: Array<any>;
  cancellation_policies: Array<any>;
  relevant_data: any;
  raw_data: any;
}

export class AddPassengerFlightDto {
  booking_flight_segment: number;
  pax: Pax;
}

export class AddPassengerTransferDto {
  booking_transfer: number;
  pax: Pax;
}

export class AddPassengerHotelRoomDto {
  hotel_room: number;
  pax: Pax;
}

export class PriceHistoryDto {
  id?: number;
  active?: boolean;
  creation_date?: Date;
  created_by?: Date;
  update_date?: string;
  update_by: string;
  amount?: number;
  commissionable_price?: number;
  non_commissionable_price?: number;
  commission_amount?: number;
  commission_taxes_amount?: number;
  net_amount?: number;
  booking_service?: number;
}

export class CreatePriceHistoryDto {
  amount?: number;
  commissionable_price?: number;
  non_commissionable_price?: number;
  commission_amount?: number;
  commission_taxes_amount?: number;
  net_amount?: number;
  booking_service?: number;
}

export class PriceHistoryFilterParamsDTO {
  booking_service?: string;
}
