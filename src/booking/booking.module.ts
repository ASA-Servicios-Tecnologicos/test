import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../configuration/configuration.module';
import { Booking, BookingSchema } from '../shared/model/booking.schema';
import { BookingController } from './booking.controller';
@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  providers: [],
  exports: [],
  controllers: [BookingController],
})
export class BookingModule {}
