import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

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
  dicountCode?: string;
  @ApiProperty()
  cancellationPolicies: Array<CancellationPolicyDTO>;
  @ApiProperty()
  hotelName: string;
  @ApiProperty()
  requestToken: string;
  @ApiProperty()
  providerToken: string;
  @ApiProperty()
  hashPrebooking: string;
  //TODO: Puede llegar un codigo de descuento, es nullable. Comprobar que existe y cuanto descuento hace y con ello amount
}
