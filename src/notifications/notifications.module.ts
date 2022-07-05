import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { NotificationService } from './services/notification.service';
import { SharedModule } from '../shared/shared.module';
import { BookingServicesService } from '../management/services/booking-services.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { ManagementService } from '../management/services/management.service';
@Module({
  imports: [AppConfigModule, HttpModule, SharedModule],
  controllers: [],
  providers: [NotificationService, BookingServicesService, ManagementHttpService, ManagementService],
  exports: [NotificationService, BookingServicesService, ManagementHttpService, ManagementService],
})
export class NotificationsModule {}
