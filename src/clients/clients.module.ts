import { DossiersModule } from './../dossiers/dossiers.module';
import { SharedModule } from './../shared/shared.module';
import { AppConfigModule } from './../configuration/configuration.module';
import { HttpModule, Module } from '@nestjs/common';
import { ManagementModule } from '../management/management.module';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';

@Module({
  imports: [
    HttpModule, 
    AppConfigModule, 
    SharedModule, 
    ManagementModule,
    DossiersModule
  ],
  controllers: [ClientsController],
  providers: [
    ClientsService
  ],
  exports: [
    ClientsService
  ],
})
export class ClientsModule {}
