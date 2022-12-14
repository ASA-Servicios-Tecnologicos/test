import { AppConfigModule } from './../configuration/configuration.module';
import { Module } from '@nestjs/common';
import { BookingServicesFlightsModule } from './booking-services-flights/booking-services-flights.module';
import { BookingServicesHotelRoomsModule } from './booking-services-hotel-rooms/booking-services-hotel-rooms.module';
import { BookingServicesTransfersModule } from './booking-services-transfers/booking-services-transfers.module';
import { BookingServicesController } from './booking-services.controller';

import { CheckoutModule } from '../checkout/checkout.module';
import { DossiersModule } from '../dossiers/dossiers.module';
import { PaymentsModule } from '../payments/payments.module';
import { BookingServicesServiceLocal } from './booking-services.service';
import { ManagementModule } from '../management/management.module';
import { CallCenterModule } from '../call-center/call-center.module';

@Module({
  imports: [
    AppConfigModule,
    BookingServicesFlightsModule,
    BookingServicesHotelRoomsModule,
    ManagementModule,
    BookingServicesTransfersModule,
    PaymentsModule,
    CheckoutModule,
    BookingServicesModule,
    DossiersModule,
    CallCenterModule,
  ],
  controllers: [BookingServicesController],
  providers: [BookingServicesServiceLocal],
  exports: [BookingServicesServiceLocal],
})
export class BookingServicesModule {}
