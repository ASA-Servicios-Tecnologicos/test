import { AppConfigService } from './../../configuration/configuration.service';
import { ManagementHttpService } from './../../management/services/management-http.service';
import { Injectable } from '@nestjs/common';
import { pickBy } from 'lodash';
@Injectable()
export class ObservationsService {

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly managementHttpService: ManagementHttpService,
  ) {}

  getObservations(filterParams: any) {
    return this.managementHttpService.get<any>(
      `${this.appConfigService.BASE_URL}/management/api/v1/observation-history/${this.mapFilterParamsToQueryParams(pickBy(filterParams))}`
    );
  }

      
  createObservation(observation: any): Promise<any> {
    return this.managementHttpService.post<any>(
      `${this.appConfigService.BASE_URL}/management/api/v1/observation-history/`, observation);
  }

  updateObservation(observation: any): Promise<any> {
    return this.managementHttpService.put<any>(
      `${this.appConfigService.BASE_URL}/management/api/v1/observation-history/`, observation);
  }


  private mapFilterParamsToQueryParams(filterParams: any): string {
    let result = '?';
    
    Object.keys(filterParams).forEach((key, index) => {
      result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
    });
    
    return encodeURI(result);
  }

}
