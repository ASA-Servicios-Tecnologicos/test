import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagementModule } from 'src/management/management.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { Booking, BookingSchema } from '../shared/model/booking.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
@Module({
  imports: [
    AppConfigModule,
    CheckoutModule,
    ManagementModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  exports: [],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
