import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutModule } from '../checkout/checkout.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ManagementModule } from '../management/management.module';
import { BookingDocumentsModule } from '../booking-documents/booking-documents.module';
import { DossiersModule } from '../dossiers/dossiers.module';
import { Booking, BookingSchema } from '../shared/model/booking.schema';

@Module({
  imports: [
    AppConfigModule,
    CheckoutModule,
    ManagementModule,
    HttpModule,
    BookingDocumentsModule,
    DossiersModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  exports: [PaymentsService],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
