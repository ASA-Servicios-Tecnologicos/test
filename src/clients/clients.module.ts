import { HttpModule, Module } from '@nestjs/common';
import { AppConfigModule } from '../configuration/configuration.module';
import { ManagementModule } from '../management/management.module';
import { ClientsController } from './clients.controller';

@Module({
  imports: [ManagementModule],
  controllers: [ClientsController],
  providers: [],
  exports: [],
})
export class ClientsModule {}
