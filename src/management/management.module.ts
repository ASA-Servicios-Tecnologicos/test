import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { SharedModule } from '../shared/shared.module';
import { AgenciesService } from './services/agencies.service';
import { BookingServicesService } from './services/booking-services.service';
import { ClientService } from './services/client.service';
import { DiscountCodeService } from './services/dicount-code.service';
import { ExternalClientService } from './services/external-client.service';
import { HotelBookingRoomsService } from './services/hotel-booking-rooms.service';
import { ManagementHttpService } from './services/management-http.service';
import { ManagementService } from './services/management.service';
@Module({
  imports: [AppConfigModule, HttpModule, SharedModule],
  controllers: [],
  providers: [
    ManagementService,
    BookingServicesService,
    ClientService,
    ManagementHttpService,
    ExternalClientService,
    DiscountCodeService,
    AgenciesService,
    HotelBookingRoomsService,
  ],
  exports: [
    ManagementService,
    BookingServicesService,
    ClientService,
    ManagementHttpService,
    ExternalClientService,
    DiscountCodeService,
    HotelBookingRoomsService,
    AgenciesService,
    HotelBookingRoomsService,
  ],
})
export class ManagementModule {}
