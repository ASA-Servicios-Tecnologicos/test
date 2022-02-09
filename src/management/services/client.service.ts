import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { GetManagementDossiersByClientId } from '../../shared/dto/dossier.dto';
import { CreateFavouriteByUser } from '../../shared/dto/favourites.dto';
import { GetManagementClientInfoByUsernameDTO, ManagementClientDTO } from '../../shared/dto/management-client.dto';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class ClientService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  async getClientById(clientId: string): Promise<ManagementClientDTO> {
    return this.managementHttpService.get<ManagementClientDTO>(`${this.appConfigService.MANAGEMENT_URL}/api/v1/clients/${clientId}/`);
  }

  async getClientInfoByUsername(username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    return this.managementHttpService.get<GetManagementClientInfoByUsernameDTO>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/client/${username}/me/`,
    );
  }

  /**
   *
   * @param clientId
   * @param type 1 - Reservas, 2 - Presupuestos
   * @returns
   */
  async getDossiersByClientUsername(username: string, type?: string | string[]): Promise<GetManagementDossiersByClientId> {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    if (Array.isArray(type)) {
      return this.managementHttpService.get<GetManagementDossiersByClientId>(
        `${this.appConfigService.MANAGEMENT_URL}/api/v1/client/${client.id}/dossier/?type=${type[0] || undefined}&type=${
          type[1] || undefined
        }`,
      );
    }
    return this.managementHttpService.get<GetManagementDossiersByClientId>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/client/${client.id}/dossier/?type=${type}`,
    );
  }

  // TODO: Pending type response and request DTO
  async patchClientByUsername(username: string, updateClientDTO): Promise<unknown> {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.patch(`${this.appConfigService.MANAGEMENT_URL}/api/v1/clients/${client.id}/`, updateClientDTO);
  }
  // TODO: Pending type response and request DTO
  async getFavouritesByUsername(username: string) {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.get(`${this.appConfigService.MANAGEMENT_URL}/api/v1/client/${client.id}/favourites/`);
  }
  // TODO: Pending type response and request DTO
  async createFavouriteByUsername(username: string, createFavouriteByUser: CreateFavouriteByUser) {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.post(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/client/${client.id}/add-favourite/`,
      createFavouriteByUser,
    );
  }
  // TODO: Pending type response and request DTO
  async deleteFavouriteByUsername(username: string, favouriteId: string) {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.delete(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/client/${client.id}/delete-favourite/${favouriteId}/`,
    );
  }
}
