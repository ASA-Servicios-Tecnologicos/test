import { CheckoutModule } from './../../checkout/checkout.module';
import { BookingModule } from './../../booking/booking.module';
import { DossiersModule } from './../../dossiers/dossiers.module';
import { NotificationsModule } from './../../notifications/notifications.module';
import { Module } from '@nestjs/common';
import { MailsService } from './mails.service';
import { MailsController } from './mails.controller';

@Module({
  imports: [DossiersModule, BookingModule, CheckoutModule, NotificationsModule],
  providers: [MailsService],
  controllers: [MailsController],
})
export class MailsModule {}
