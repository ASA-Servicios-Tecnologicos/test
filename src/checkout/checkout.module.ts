import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { CheckoutService } from './services/checkout.service';
@Module({
  imports: [AppConfigModule, HttpModule, SharedModule],
  controllers: [],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
