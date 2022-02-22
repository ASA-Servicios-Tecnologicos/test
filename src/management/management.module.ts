import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { SharedModule } from '../shared/shared.module';
import { BookingServicesService } from './services/booking-services.service';
import { ClientService } from './services/client.service';
import { DiscountCodeService } from './services/dicount-code.service';
import { ExternalClientService } from './services/external-client.service';
import { ManagementHttpService } from './services/management-http.service';
import { ManagementService } from './services/management.service';
import { PackagesNewblueService } from './services/packages-newblue.service';
import { PackagesProvidersService } from './services/packages-providers.service';
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
    PackagesProvidersService,
    PackagesNewblueService,
  ],
  exports: [
    ManagementService,
    BookingServicesService,
    ClientService,
    ManagementHttpService,
    ExternalClientService,
    DiscountCodeService,
    PackagesProvidersService,
    PackagesNewblueService,
  ],
})
export class ManagementModule {}
