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

export enum PolicyType {
  'ABSOLUTE',
  'PERCENTAGE',
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
  //TODO: Puede llegar un codigo de descuento, es nullable. Comprobar que existe y cuanto descuento hace y con ello amount
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
