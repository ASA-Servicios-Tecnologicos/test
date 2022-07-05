import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingDocumentsModule } from '../booking-documents/booking-documents.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { Booking, BookingSchema } from '../shared/model/booking.schema';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ManagementModule } from '../management/management.module';
import { PaymentsModule } from '../payments/payments.module';
import { DossiersModule } from '../dossiers/dossiers.module';
import { NotificationsModule } from '../notifications/notifications.module';
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
