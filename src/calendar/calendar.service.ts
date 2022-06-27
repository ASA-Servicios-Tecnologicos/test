import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { ReferencePricesRequestDTO } from '../shared/dto/calendar.dto';

@Injectable()
export class CalendarService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}
  /*getReferencePrices(referencePricesRequestDTO: ReferencePricesRequestDTO) {
    return this.managementHttpService.post(
      `${this.appConfigService.BASE_URL}/packages-newblue/api/v1/referencePrices/`,
      referencePricesRequestDTO,
    );
  }*/
}
