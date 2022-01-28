import { HttpService, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AppConfigService } from '../configuration/configuration.service';
import { CreateBudgetDto, CreateManagementBudgetDto } from '../shared/dto/budget.dto';
import { CreateBudgetResponseDTO } from '../shared/dto/create-budget-response.dto';
import { SecuredHttpService } from '../shared/services/secured-http.service';

@Injectable()
export class BudgetService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService) {
    super(http, appConfigService);
  }

  create(createBudgetDTO: CreateBudgetDto): Observable<CreateBudgetResponseDTO> {
    return this.http
      .post<CreateBudgetResponseDTO>(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/booking/budget`, createBudgetDTO)
      .pipe(map((response) => response.data));
  }

  findById(id: string) {
    // return this.bookingModel.findById(id);
  }

  /**
   * Maps OTA budgate to Management Budget DTO
   * @param createBudgetDTO
   * @returns
   */
  private mapOtaBudgetToManagementBudget(createBudgetDTO: CreateBudgetDto): CreateManagementBudgetDto {
    return null;
  }

  private createManagementBudget(createManagementBudgetDto: CreateManagementBudgetDto): Observable<CreateBudgetResponseDTO> {
    return this.http
      .post<CreateBudgetResponseDTO>(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/booking/budget`, createManagementBudgetDto)
      .pipe(map((response) => response.data));
  }
}
