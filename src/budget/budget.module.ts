import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from '../configuration/configuration.module';
import { ManagementModule } from '../management/management.module';
import { Booking, BookingSchema } from '../shared/model/booking.schema';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
@Module({
  imports: [AppConfigModule, ManagementModule, HttpModule],
  exports: [],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
