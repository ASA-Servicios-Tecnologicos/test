import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CancellationPolicyDTO, Distribution, Room } from "../dto/booking.dto";

export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  @Prop({ required: true })
  bookingId: string;

  @Prop({ required: true })
  checkoutId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  programId: string;

  @Prop({ required: true })
  checkIn: string;

  @Prop({ required: true })
  checkOut: string;

  @Prop({ required: true })
  distribution: Array<Distribution>;

  @Prop({ required: true })
  prebookingToken: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  market: string;

  @Prop({ required: true })
  language: string;

  @Prop({ required: true })
  currency: string;

  @Prop()
  session?: string;

  @Prop({ required: true })
  okUrl: string;

  @Prop({ required: true })
  koUrl: string;

  @Prop()
  dicountCode?: string;

  @Prop()
  requestToken: string;

  @Prop()
  providerToken: string;

  @Prop()
  hotelName: string;

  @Prop()
  cancellationPolicies: CancellationPolicyDTO[];
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
