import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { GetManagementClientInfoByUsernameDTO, ManagementClientDTO } from '../../shared/dto/management-client.dto';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class ClientService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  async getClientById(clientId: string): Promise<ManagementClientDTO> {
    return this.managementHttpService.get<ManagementClientDTO>(
      `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/clients/${clientId}/`,
    );
  }

  async getClientInfoByUsername(username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    return this.managementHttpService.get<GetManagementClientInfoByUsernameDTO>(
      `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/client/${username}/me/`,
    );
  }
}
