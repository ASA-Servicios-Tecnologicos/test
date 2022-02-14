import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ManagementModule } from 'src/management/management.module';
import { Booking, BookingSchema } from 'src/shared/model/booking.schema';
import { CheckoutModule } from '../checkout/checkout.module';
import { AppConfigModule } from '../configuration/configuration.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
@Module({
  imports: [
    AppConfigModule,
    CheckoutModule,
    ManagementModule,
    HttpModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  exports: [PaymentsService],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
