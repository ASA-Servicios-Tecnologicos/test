import { Body, Controller, Get, Param, Patch, Put, Query } from '@nestjs/common';
import { ClientService } from '../management/services/client.service';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Get(':username')
  getClients(@Param('username') username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    return this.clientService.getClientInfoByUsername(username);
  }

  @Patch(':username')
  updateClientByUsername(@Param('username') username: string, @Body() updateClientDTO) {
    return this.clientService.patchClientByUsername(username, updateClientDTO);
  }
}
