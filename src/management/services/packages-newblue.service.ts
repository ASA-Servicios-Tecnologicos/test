import { HeadersDTO } from './../../shared/dto/header.dto';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { ManagementHttpService } from './management-http.service';

export class ReferencePricesResponseDTO {
  data?: DataPriceDTO;
  status?: number;
}
export class DataPriceDTO {
  rows?: ProductPriceDTO[];
  count?: number;
}
export class ProductPriceDTO {
  origins?: OriginsDTO[];
}
export class OriginsDTO {
  dates?: DatesPricesDTO[];
  origin?: any;
}
export class DatesPricesDTO {
  date?: string;
  amount?: number;
  status?: string;
}

@Injectable()
export class PackagesNewblueService {
  constructor(private readonly appConfigService: AppConfigService, private readonly managementHttpService: ManagementHttpService) {}

  async postPackagesNewblueReferencePrices(data, headers?: HeadersDTO) {
    return this.managementHttpService.post<ReferencePricesResponseDTO>(
      `${this.appConfigService.BASE_URL}/packages-newblue/api/v1/referencePrices`,
      data,
      {
        headers,
      },
    );
  }
}
