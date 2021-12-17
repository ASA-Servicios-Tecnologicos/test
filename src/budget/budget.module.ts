import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../configuration/configuration.module';
import { Booking, BookingSchema } from '../shared/model/booking.schema';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  exports: [],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
