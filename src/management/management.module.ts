import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { BookingServicesService } from './services/booking-services.service';
import { ClientService } from './services/client.service';
import { ManagementService } from './services/management.service';
@Module({
  imports: [AppConfigModule, HttpModule],
  controllers: [],
  providers: [ManagementService, BookingServicesService, ClientService],
  exports: [ManagementService, BookingServicesService, ClientService],
})
export class ManagementModule {}
