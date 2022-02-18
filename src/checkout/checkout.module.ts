import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { CheckoutService } from './services/checkout.service';
@Module({
  imports: [AppConfigModule, HttpModule],
  controllers: [],
  providers: [CheckoutService],
  exports: [CheckoutService],
})
export class CheckoutModule {}
