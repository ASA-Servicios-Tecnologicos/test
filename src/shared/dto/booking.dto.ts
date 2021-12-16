import { ApiProperty } from '@nestjs/swagger';
import { BookingStatusEnum } from '../enum/booking-status.enum';

export class Pax {
  @ApiProperty()
  age: string;
}

export class Room {
  @ApiProperty({ type: [Pax] })
  pax: Pax[];
}

export class BookingDTO {
  @ApiProperty()
  id: string;
  @ApiProperty()
  checkoutId: string;
  @ApiProperty()
  programId: string;
  @ApiProperty()
  productId: string;
  @ApiProperty()
  checkIn: string;
  @ApiProperty()
  checkOut: string;
  @ApiProperty()
  status: BookingStatusEnum;
  @ApiProperty({ type: [Room] })
  distribution: Room[];
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
  @ApiProperty()
  session: string;
}
