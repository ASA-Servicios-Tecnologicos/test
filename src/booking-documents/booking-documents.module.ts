import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { BookingDocumentsService } from './services/booking-documents.service';
import { ManagementModule } from '../management/management.module';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [HttpModule, AppConfigModule, ManagementModule, NotificationsModule],
  controllers: [],
  providers: [BookingDocumentsService],
  exports: [BookingDocumentsService],
})
export class BookingDocumentsModule {}
