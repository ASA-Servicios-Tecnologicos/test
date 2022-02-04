import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AppConfigService } from '../../configuration/configuration.service';
import { GetManagementClientInfoByUsernameDTO, ManagementClientDTO } from '../../shared/dto/management-client.dto';
import { ManagementService } from './management.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly managementService: ManagementService,
    private readonly http: HttpService,
    private readonly appConfigService: AppConfigService,
  ) {}

  async getClientById(clientId: string): Promise<ManagementClientDTO> {
    const token = await this.managementService.auth();

    return firstValueFrom(
      this.http.get<ManagementClientDTO>(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/clients/${clientId}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    )
      .then((res) => res.data)
      .catch((err) => {
        throw new HttpException(err.message, err.response.status);
      });
  }

  async getClientInfoByUsername(username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    const token = await this.managementService.auth();
    return firstValueFrom(
      this.http.get<GetManagementClientInfoByUsernameDTO>(
        `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/client/${username}/me/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    )
      .then((res) => res.data)
      .catch((err) => {
        throw new HttpException(err.response.data[0] || err.message, err.response.status);
      });
  }
}
