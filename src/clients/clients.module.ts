import { Module } from '@nestjs/common';
import { ManagementModule } from '../management/management.module';
import { ClientsController } from './clients.controller';

@Module({
  imports: [ManagementModule],
  controllers: [ClientsController],
  providers: [],
  exports: [],
})
export class ClientsModule {}
