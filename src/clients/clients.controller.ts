import { Controller, Get, Param, Query } from '@nestjs/common';
import { ClientService } from '../management/services/client.service';
import { GetManagementDossiersByClientId } from '../shared/dto/dossier.dto';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getClients(@Query('username') username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    return this.clientService.getClientInfoByUsername(username);
  }

  @Get(':id/dossiers')
  getClientDossiersById(@Param('id') id: string, @Query('type') type: number): Promise<GetManagementDossiersByClientId> {
    return this.clientService.getDossiersByClientIdOrDossierType(id, type);
  }
}
