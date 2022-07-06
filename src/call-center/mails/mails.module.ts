import { ManagementModule } from './../../management/management.module';
import { NotificationsModule } from './../../notifications/notifications.module';
import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';

@Module({
  imports: [ManagementModule, NotificationsModule],
  providers: [MailsService],
  controllers: [MailsController],
})
export class MailsModule {}
