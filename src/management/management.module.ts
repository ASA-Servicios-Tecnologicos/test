import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { ManagementService } from './services/management.service';
@Module({
  imports: [AppConfigModule, HttpModule],
  controllers: [],
  providers: [ManagementService],
  exports: [ManagementService],
})
export class ManagementModule {}
