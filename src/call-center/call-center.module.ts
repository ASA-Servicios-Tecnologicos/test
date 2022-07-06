import { Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { DossiersModule } from '../dossiers/dossiers.module';
import { ManagementModule } from '../management/management.module';
import { PaymentsModule } from '../payments/payments.module';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './call-center.service';
import { ObservationsModule } from './observations/observations.module';
import { BudgetModule } from '../budget/budget.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { BookingModule } from '../booking/booking.module';
import { CheckoutModule } from '../checkout/checkout.module';

@Module({
  imports: [
    AppConfigModule,
    ManagementModule,
    PaymentsModule,
    DossiersModule,
    BudgetModule,
    NotificationsModule,
    BookingModule,
    CheckoutModule,
    ObservationsModule,
  ],
  controllers: [CallCenterController],
  providers: [CallCenterService],
  exports: [CallCenterService],
})
export class CallCenterModule {}
