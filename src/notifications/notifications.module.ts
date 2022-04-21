import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { NotificationService } from './services/notification.service';
@Module({
  imports: [AppConfigModule, HttpModule, SharedModule],
  controllers: [],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
