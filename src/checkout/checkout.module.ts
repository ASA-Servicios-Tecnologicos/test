import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { CheckoutService } from './services/checkout.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Booking, BookingSchema } from "../shared/model/booking.schema";
@Module({
  imports: [AppConfigModule,
    HttpModule,
    SharedModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),],
  controllers: [],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule { }
