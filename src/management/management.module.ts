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
import { ManagementSetupService } from './management-setup/management-setup.service';
import { ManagementService } from './services/management.service';
import { PackagesNewblueService } from './services/packages-newblue.service';
import { PackagesProvidersService } from './services/packages-providers.service';
import { NotificationService } from './../notifications/services/notification.service';
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
    PackagesProvidersService,
    PackagesNewblueService,
    ManagementSetupService,
    NotificationService
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
    PackagesProvidersService,
    PackagesNewblueService,
    ManagementSetupService,
  ],
})
export class ManagementModule {}
