import { Controller, Get, Query } from '@nestjs/common';
import { ClientService } from '../management/services/client.service';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  getClients(@Query('username') username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    return this.clientService.getClientInfoByUsername(username);
  }
}
