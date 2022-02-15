import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementHttpService } from '../management/services/management-http.service';

@Injectable()
export class CalendarService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}
  getReferencePrices() {
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/packages-newblue/api/v1/pre-bookings/${hash}/`);
  }
}
