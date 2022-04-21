import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { ManagementModule } from '../management/management.module';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
@Module({
  imports: [AppConfigModule, ManagementModule, HttpModule],
  exports: [BudgetService],
  controllers: [BudgetController],
  providers: [BudgetService],
})
export class BudgetModule {}
