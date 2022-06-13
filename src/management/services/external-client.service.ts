import { HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { CreateExternalUserDTO, ExternalUserDTO } from 'src/shared/dto/external-user.dto';
import { CLIENT_NOT_ACTIVE_ERROR } from '../management.constants';
import { ClientService } from './client.service';
import { ManagementHttpService } from './management-http.service';
import { logger } from '../../logger';
@Injectable()
export class ExternalClientService {
  constructor(
    private readonly managementHttpService: ManagementHttpService,
    private readonly appConfigService: AppConfigService,
    private readonly clientService: ClientService,
  ) {}

  // TODO: Pending testing
  async createExternalClient(user: CreateExternalUserDTO) {
    logger.info(`[ExternalClientService] [createExternalClient] init method`)
    return this.managementHttpService
      .post<ExternalUserDTO>(`${this.appConfigService.BASE_URL}/management/api/v1/client/external/flowo/`, user)
      .catch(async (err) => {
        // Handles if user exists but is not activated.
        // Then activates it and updates its privacy policy with current date
        if (
          (err.response?.error[0] && err.response?.error[0] === CLIENT_NOT_ACTIVE_ERROR && err.status === HttpStatus.BAD_REQUEST) ||
          (err.response?.error && err.response.error === CLIENT_NOT_ACTIVE_ERROR && err.status === HttpStatus.BAD_REQUEST)
        ) {
          // Activates user
          const userActive = await this.clientService.patchClientByUsername(user.username, {
            accept_privacy_policy: new Date().toISOString(),
            active: true,
          });
          logger.warn(`[ExternalClientService] [createExternalClient] activated user --user ${userActive} `)
          return {
            client: userActive.id,
          };
        }
        logger.error(`[ExternalClientService] [createExternalClient] ${err.stack} `)
        throw err;
      });
  }
}
