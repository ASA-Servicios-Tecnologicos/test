import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DossiersModule } from 'src/dossiers/dossiers.module';
import { ManagementModule } from 'src/management/management.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { BookingDocumentsModule } from '../booking-documents/booking-documents.module';
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
    HttpModule,
    PaymentsModule,
    DossiersModule,
    NotificationsModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
    BookingDocumentsModule,
  ],
  exports: [BookingService],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
