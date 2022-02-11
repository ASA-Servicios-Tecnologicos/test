import { HttpModule, Module } from '@nestjs/common';
import { ManagementModule } from 'src/management/management.module';
import { CheckoutModule } from '../checkout/checkout.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
@Module({
  imports: [AppConfigModule, CheckoutModule, ManagementModule, HttpModule],
  exports: [PaymentsService],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
