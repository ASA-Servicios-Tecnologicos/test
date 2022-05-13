import { Injectable } from '@nestjs/common';
import { PatchExternalClient } from 'src/shared/dto/external-user.dto';
import { AppConfigService } from '../../configuration/configuration.service';
import { DossierClientDTO } from '../../shared/dto/dossier-client.dto';
import { GetManagementDossiersByClientId } from '../../shared/dto/dossier.dto';
import { CreateFavouriteByUser } from '../../shared/dto/favourites.dto';
import { GetManagementClientInfoByUsernameDTO, ManagementClientDTO, IntegrationClientDTO } from '../../shared/dto/management-client.dto';
import { NotificationService } from 'src/notifications/services/notification.service';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class ClientService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService, private notificationService: NotificationService) {}

  getClientById(clientId: string): Promise<ManagementClientDTO> {
    return this.managementHttpService.get<ManagementClientDTO>(`${this.appConfigService.BASE_URL}/management/api/v1/clients/${clientId}/`);
  }

  getClientInfoByUsername(username: string): Promise<GetManagementClientInfoByUsernameDTO> {
    let usernameEncode = username.includes('+'.charAt(0)) ? username.replace('+', '%2B') : username;
    return this.managementHttpService.get<GetManagementClientInfoByUsernameDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/client/me/?username=${usernameEncode}`,
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
        `${this.appConfigService.BASE_URL}/management/api/v1/client/${client.id}/dossier/?type=${type[0] || undefined}&type=${
          type[1] || undefined
        }`,
      );
    }
    return this.managementHttpService.get<GetManagementDossiersByClientId>(
      `${this.appConfigService.BASE_URL}/management/api/v1/client/${client.id}/dossier/?type=${type}`,
    );
  }

  async patchClientByUsername(username: string, updateClientDTO: Partial<DossierClientDTO>): Promise<PatchExternalClient> {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.patch(`${this.appConfigService.BASE_URL}/management/api/v1/clients/${client.id}/`, updateClientDTO);
  }
  // TODO: Pending type response and request DTO
  async getFavouritesByUsername(username: string) {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/management/api/v1/client/${client.id}/favourites/`);
  }
  // TODO: Pending type response and request DTO
  async createFavouriteByUsername(username: string, createFavouriteByUser: CreateFavouriteByUser) {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.post(
      `${this.appConfigService.BASE_URL}/management/api/v1/client/${client.id}/add-favourite/`,
      createFavouriteByUser,
    );
  }
  // TODO: Pending type response and request DTO
  async deleteFavouriteByUsername(username: string, favouriteId: string) {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.delete(
      `${this.appConfigService.BASE_URL}/management/api/v1/client/${client.id}/delete-favourite/${favouriteId}/`,
    );
  }

  async subscribeToNewsletter(username: string, newsletterRequestDTO: { permit_email: boolean }) {
    const client: GetManagementClientInfoByUsernameDTO = await this.getClientInfoByUsername(username);
    return this.managementHttpService.put(
      `${this.appConfigService.BASE_URL}/management/api/v1/client/${client.id}/newsletter/`,
      newsletterRequestDTO,
      );
    }
    
    async AddToNewsletter(newsletterRequestDTO: { email: string }) {
    console.log(newsletterRequestDTO);
    const response = await this.managementHttpService.post(
      `${this.appConfigService.BASE_URL}/management/api/v1/client/external/add-newsletter/`,
      newsletterRequestDTO,
    );
    console.log(response);
    if (response !== "Este email ya esta suscrito a la newsletter") this.notificationService.sendNewsletterConfirmation(newsletterRequestDTO.email); 
  }

  getIntegrationClient() {
    return this.managementHttpService.get<IntegrationClientDTO>(`${this.appConfigService.BASE_URL}/management/api/v1/user/me/`);
  }

  patchClientById(clientId: string, dossierClientDto: Partial<DossierClientDTO>) {
    return this.managementHttpService.patch(`${this.appConfigService.BASE_URL}/management/api/v1/clients/${clientId}/`, dossierClientDto);
  }
}
