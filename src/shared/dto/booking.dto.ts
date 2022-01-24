import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class Pax {
  @ApiProperty()
  age: string;
}

export class Room {
  @ApiProperty({ type: [Pax] })
  pax: Pax[];
}

export class Distribution {
  @ApiProperty()
  adults: number;
  @ApiProperty()
  childrens: Array<string>;
  @ApiProperty()
  rooms: number;
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
}

export enum PolicyType {
  "ABSOLUTE",
  "PERCENTAGE",
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
  distribution: Array<Distribution>;
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
  //TODO: Puede llegar un codigo de descuento, es nullable. Comprobar que existe y cuanto descuento hace y con ello amount
}
