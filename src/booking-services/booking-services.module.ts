import { Module } from '@nestjs/common';
import { ManagementModule } from 'src/management/management.module';
import { BookingServicesFlightsModule } from './booking-services-flights/booking-services-flights.module';
import { BookingServicesHotelRoomsModule } from './booking-services-hotel-rooms/booking-services-hotel-rooms.module';
import { BookingServicesTransfersModule } from './booking-services-transfers/booking-services-transfers.module';
import { BookingServicesController } from './booking-services.controller';

import { CheckoutModule } from '../checkout/checkout.module';
import { DossiersModule } from '../dossiers/dossiers.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [BookingServicesFlightsModule, BookingServicesHotelRoomsModule, ManagementModule, BookingServicesTransfersModule, 
    PaymentsModule,
    CheckoutModule,
    BookingServicesModule,
    DossiersModule
  ],
  controllers: [BookingServicesController],
  providers: [],
  exports: [],
})
export class BookingServicesModule { }
