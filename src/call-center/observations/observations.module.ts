import { ManagementModule } from './../../management/management.module';
import { AppConfigModule } from './../../configuration/configuration.module';
import { Module } from '@nestjs/common';
import { ObservationsController } from './observations.controller';
import { ObservationsService } from './observations.service';

@Module({
  imports: [AppConfigModule, ManagementModule],
  controllers: [ObservationsController],
  providers: [ObservationsService],
  exports: [ObservationsService],
})
export class ObservationsModule {}
