import { HttpModule, Module } from '@nestjs/common';
import { ManagementModule } from 'src/management/management.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { BookingDocumentsService } from './services/booking-documents.service';
@Module({
  imports: [HttpModule, AppConfigModule, ManagementModule, NotificationsModule],
  controllers: [],
  providers: [BookingDocumentsService],
  exports: [BookingDocumentsService],
})
export class BookingDocumentsModule {}
