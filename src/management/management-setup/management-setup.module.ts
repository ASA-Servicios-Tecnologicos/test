import { Module } from '@nestjs/common';
import { AppConfigModule } from '../../configuration/configuration.module';
import { ManagementModule } from '../management.module';
import { ManagementSetupController } from './management-setup.controller';
import { ManagementSetupService } from './management-setup.service';

@Module({
  imports: [ManagementModule, AppConfigModule],
  providers: [ManagementSetupService],
  controllers: [ManagementSetupController],
  exports: [ManagementSetupService],
})
export class ManagementSetupModule {}
