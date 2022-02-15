import { Injectable } from '@nestjs/common';

@Injectable()
export class CalendarService {
  getReferencePrices() {
    return this.managementHttpService.get(`${this.appConfigService.BASE_URL}/packages-newblue/api/v1/pre-bookings/${hash}/`);
  }
}
