import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { GetManagementDossiersByClientId } from '../../shared/dto/dossier.dto';
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

  /**
   *
   * @param clientId
   * @param type 1 - Reservas, 2 - Presupuestos
   * @returns
   */
  async getDossiersByClientIdOrDossierType(clientId: string, type?: number): Promise<GetManagementDossiersByClientId> {
    const token = await this.managementService.auth();
    return firstValueFrom(
      this.http.get<GetManagementDossiersByClientId>(
        `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/client/${clientId}/dossier/?type=${type}`,
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
