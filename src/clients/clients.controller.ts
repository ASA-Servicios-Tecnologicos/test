import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ClientService } from '../management/services/client.service';
import { GetManagementDossiersByClientId } from '../shared/dto/dossier.dto';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':username/dossiers')
  getClientDossiersById(@Param('username') username: string, @Query('type') type: number): Promise<GetManagementDossiersByClientId> {
    return this.clientService.getDossiersByClientUsername(username, type);
  }

  @Get(':username')
  getClients(@Param('username') username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    return this.clientService.getClientInfoByUsername(username);
  }

  @Patch(':username')
  updateClientByUsername(@Param('username') username: string, @Body() updateClientDTO) {
    return this.clientService.patchClientByUsername(username, updateClientDTO);
  }
}
