import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { CreateExternalUserDTO, ExternalUserDTO } from 'src/shared/dto/external-user.dto';
import { ManagementHttpService } from './management-http.service';
@Injectable()
export class ExternalClientService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  async createExternalClient(user: CreateExternalUserDTO) {
    return this.managementHttpService.post<ExternalUserDTO>(`${this.appConfigService.TECNOTURIS_URL}/client/external/`, user);
  }
}
