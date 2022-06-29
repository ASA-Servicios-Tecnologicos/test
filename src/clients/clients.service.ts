import { DossiersService } from 'src/dossiers/dossiers.service';
import { CacheService } from './../shared/services/cache.service';
import { SecuredHttpService } from 'src/shared/services/secured-http.service';
import { AppConfigService } from './../configuration/configuration.service';

import { ForbiddenException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { logger } from '../logger';

@Injectable()
export class ClientsService extends SecuredHttpService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    readonly cacheService: CacheService<any>,
    readonly dossiersService: DossiersService,
  ) {
    super(http, appConfigService, cacheService);
  }

  async getBookingReportByDossier(response: Response, username: string, bookingCode: string, language: string) {
    logger.info(`[ClientsService] [getBookingReportByDossier] init method`);

    const dossier = await this.dossiersService.findDossierById(bookingCode);

    if (dossier && dossier.client && (dossier.client.email === username || dossier.client.phone === username)) {
      const data = {
        language,
        brandCode: 'FLOWO',
        types: ['CLIENT'],
        subtype: 'CONFIRMATION',
        bookingCode: bookingCode,
      };

      const bookingReport = await this.postSecured(
        'https://pre-api.w2m.com/integration/booking-report/api/v1/report/booking-storage',
        data,
      );

      return response.status(HttpStatus.OK).send(bookingReport.data.map((element) => ({ url: element.url, filename: element.fileName })));
    }

    return response.status(HttpStatus.FORBIDDEN).send(new ForbiddenException());
  }
}
