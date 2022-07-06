import { CreatePriceHistoryDto, PriceHistoryDto, PriceHistoryFilterParamsDTO } from './../shared/dto/booking-service.dto';
import { AppConfigService } from '../configuration/configuration.service';
import { HeadersDTO } from './../shared/dto/header.dto';
import { ManagementHttpService } from '../management/services/management-http.service';
import { Injectable } from '@nestjs/common';
import { pickBy } from 'lodash';

@Injectable()
export class BookingServicesServiceLocal {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) {}

  getPriceHistory(filterParams: PriceHistoryFilterParamsDTO, headers?: HeadersDTO) {
    return this.managementHttpService.get<PriceHistoryDto[]>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/price-history/${this.mapFilterParamsToQueryParams(
        pickBy(filterParams),
      )}`,
      { headers },
    );
  }

  createPriceHistory(body: CreatePriceHistoryDto, headers?: HeadersDTO): Promise<any> {
    return this.managementHttpService.post<PriceHistoryDto>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/price-history/`,
      body,
      {
        headers,
      },
    );
  }

  private mapFilterParamsToQueryParams(filterParams: any): string {
    let result = '?';

    Object.keys(filterParams).forEach((key, index) => {
      result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
    });

    return encodeURI(result);
  }
}
