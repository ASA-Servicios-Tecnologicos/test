import { Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { ManagementModule } from '../management/management.module';
import { PaymentsModule } from '../payments/payments.module';
import { CallCenterController } from './call-center.controller';
import { CallCenterService } from './call-center.service';

@Module({
  imports: [AppConfigModule, ManagementModule, PaymentsModule],
  controllers: [CallCenterController],
  providers: [CallCenterService],
  exports: [],
})
export class CallCenterModule {}
