import { Module } from '@nestjs/common';
import { BookingModule } from 'src/booking/booking.module';
import { BudgetModule } from 'src/budget/budget.module';
import { CheckoutModule } from 'src/checkout/checkout.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { DossiersModule } from '../dossiers/dossiers.module';
import { ManagementModule } from '../management/management.module';
import { PaymentsModule } from '../payments/payments.module';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './call-center.service';
import { ObservationsModule } from './observations/observations.module';

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
