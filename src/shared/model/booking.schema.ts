import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Room } from '../dto/booking.dto';
import { BookingStatusEnum } from '../enum/booking-status.enum';

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  checkoutId: string;

  @Prop({ required: true })
  programId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  checkIn: Date;

  @Prop({ required: true })
  checkOut: Date;

  @Prop({ required: true })
  status: BookingStatusEnum;

  @Prop({ required: true })
  distribution: Room[];

  @Prop({ required: true })
  prebookingToken: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ required: true })
  market: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  session: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
