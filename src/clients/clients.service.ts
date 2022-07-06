import { CacheService } from './../shared/services/cache.service';
import { AppConfigService } from './../configuration/configuration.service';

import { ForbiddenException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { logger } from '../logger';
import { SecuredHttpService } from '../shared/services/secured-http.service';
import { DossiersService } from '../dossiers/dossiers.service';
import { ClientService } from '../management/services/client.service';
import { GetManagementClientInfoByUsernameDTO } from '../shared/dto/management-client.dto';

@Injectable()
export class ClientsService extends SecuredHttpService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    readonly cacheService: CacheService<any>,
    readonly dossiersService: DossiersService,
    readonly _clientService: ClientService,
  ) {
    super(http, appConfigService, cacheService);
  }

  async getBookingReportByDossier(response: Response, username: string, bookingCode: string, language: string) {
    logger.info(`[ClientsService] [getBookingReportByDossier] init method`);

    const client: GetManagementClientInfoByUsernameDTO = await this._clientService.getClientInfoByUsername(username);
    const dossier = await this.dossiersService.findDossierById(bookingCode);

    if (dossier && dossier.client && client && client.id === dossier.client.id) {
      const data = {
        language,
        brandCode: 'FLOWO',
        types: ['CLIENT'],
        subtype: 'CONFIRMATION',
        bookingCode: bookingCode,
      };

      const bookingReport = await this.postSecured(
        `${this.appConfigService.W2M_URL}/integration/booking-report/api/v1/report/booking-storage`,
        data,
      );

      return response.status(HttpStatus.OK).send(bookingReport.data.map((element) => ({ url: element.url, filename: element.fileName })));
    }

    return response.status(HttpStatus.FORBIDDEN).send(new ForbiddenException());
  }
}
