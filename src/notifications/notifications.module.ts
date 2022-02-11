import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { NotificationService } from './services/notification.service';
@Module({
  imports: [AppConfigModule, HttpModule],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
