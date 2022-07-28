import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CreateManagementBudgetDto } from './budget.dto';

export class Pax {
  @ApiProperty()
  age: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  type: 'ADULT' | 'CHILD';
}

export class Room {
  @ApiProperty()
  code: string;
  @ApiProperty()
  passengers: Array<Pax>;
}

export class CancellationPolicyDTO {
  @ApiProperty()
  start: string;
  @ApiProperty()
  end: string;
  @ApiProperty()
  type: PolicyType;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  text: string;
}

export class DistributionDTO {
  @ApiProperty()
  room: string;
  @ApiProperty()
  age: number;
  @ApiProperty()
  extCode: string;
  @ApiProperty()
  type: 'ADULT' | 'CHILD';
}

export class DiscountDTO {
  @ApiProperty()
  rate?: number;
  @ApiProperty()
  amount?: any;
  @ApiProperty()
  amountCurrency?: any;
}

export enum PolicyType {
  'ABSOLUTE',
  'PERCENTAGE',
}

export enum applyTOEnum {
  'PASSENGER',
}

export class InfoRequirementsDTO {
  @ApiProperty()
  applyTO?: applyTOEnum;
  @ApiProperty()
  codes?: Array<string>;
  @ApiProperty()
  fields?: Array<any>;
}

export class PrebookingDTO {
  @ApiProperty()
  data?: any;
  @ApiProperty()
  status?: number;
}

export class BookingDTO {
  @ApiProperty()
  @Optional()
  bookingId?: string;
  @ApiProperty()
  programId: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  checkIn: string;
  @ApiProperty()
  checkOut: string;
  @ApiProperty()
  distribution: Array<DistributionDTO>;
  @ApiProperty()
  prebookingToken: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  market: string;
  @ApiProperty()
  language: string;
  @ApiProperty()
  currency: string;
  @ApiProperty() //TODO
  session?: string;
  @ApiProperty()
  okUrl: string;
  @ApiProperty()
  koUrl: string;
  @ApiProperty()
  backURL: string;
  @ApiProperty()
  discount?: DiscountDTO;
  @ApiProperty()
  cancellationPolicies: Array<CancellationPolicyDTO>;
  @ApiProperty()
  hotelName: string;
  @ApiProperty()
  requestToken: string;
  @ApiProperty()
  providerToken: string;
  @ApiProperty()
  providerName: string;
  @ApiProperty()
  hashPrebooking: string;
  @ApiProperty()
  packageName: string;
  @ApiProperty()
  productName: string;
  @ApiProperty()
  productCode: string;
  @ApiProperty()
  packageCategory: string;
  @ApiProperty()
  packageCountry: string;
  @ApiProperty()
  packageDestination: string;
  //TODO: Puede llegar un codigo de descuento, es nullable. Comprobar que existe y cuanto descuento hace y con ello amount
  @ApiProperty()
  infoRequirements: Array<InfoRequirementsDTO>;
  @ApiProperty()
  prebooking: PrebookingDTO;
}

export class CreateManagementBookDto extends CreateManagementBudgetDto {
  dossier: any;
}

export interface ManagementBookDTO {
  id: number;
  dossier: number;
  description: string;
  total_pvp: number;
  total_abono: number;
  provider_service_id: number;
  locator: string;
  discount: number;
  fiscal_location_id: number;
  iva_type_id: any;
  iva: number;
}

export interface DiscountDTO {
  rate?: number;
  amount?: any;
  amountCurrency?: any;
  couponCode?: string;
  status?: number;
}

export interface DiscountCode {
  sellChannel: string;
  brandCode: string;
  bookingDate: string;
  couponCode: string;
}

export interface BookPackageProviderDTO {
  data: {
    bookId: string;
    requestToken: string;
    providerToken: string;
    agency: string;
    status: string;
    creationDate: string;
    checkIn: string;
    checkOut: string;
    totalAmount: number;
    currency: string;
    pendingAmount: number;
    detailedPricing: {
      commissionableRate: number;
      nonCommissionableRate: number;
    };
    commission: {
      commissionRate: number;
      fee: number;
      iva: number;
      commission: number;
      pvp: number;
    };
  };
  status: number;
}

export interface CancellationPolicyPackageDTO {
  amount: number;
  fromDate: string;
  toDate: string;
  currency: string;
  type: any;
  text: string;
}
