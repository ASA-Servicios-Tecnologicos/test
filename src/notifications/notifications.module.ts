import { HttpModule, Module } from '@nestjs/common';
import { BookingServicesService } from 'src/management/services/booking-services.service';
import { ManagementHttpService } from 'src/management/services/management-http.service';
import { ManagementService } from 'src/management/services/management.service';
import { SharedModule } from 'src/shared/shared.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { NotificationService } from './services/notification.service';
@Module({
  imports: [AppConfigModule, HttpModule, SharedModule],
  controllers: [],
  providers: [NotificationService, BookingServicesService, ManagementHttpService, ManagementService],
  exports: [NotificationService, BookingServicesService, ManagementHttpService, ManagementService],
})
export class NotificationsModule {}
