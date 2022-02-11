import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { SharedModule } from '../shared/shared.module';
import { BookingServicesService } from './services/booking-services.service';
import { ClientService } from './services/client.service';
import { ExternalClientService } from './services/external-client.service';
import { ManagementHttpService } from './services/management-http.service';
import { ManagementService } from './services/management.service';
@Module({
  imports: [AppConfigModule, HttpModule, SharedModule],
  controllers: [],
  providers: [ManagementService, BookingServicesService, ClientService, ManagementHttpService, ExternalClientService],
  exports: [ManagementService, BookingServicesService, ClientService, ManagementHttpService, ExternalClientService],
})
export class ManagementModule {}
