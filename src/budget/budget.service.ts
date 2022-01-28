import { HttpService, Injectable } from '@nestjs/common';
import { map, Observable, of } from 'rxjs';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementService } from '../management/services/management.service';
import { CreateBudgetDto, CreateManagementBudgetDto } from '../shared/dto/budget.dto';
import { CreateBudgetResponseDTO } from '../shared/dto/create-budget-response.dto';
import { SecuredHttpService } from '../shared/services/secured-http.service';

@Injectable()
export class BudgetService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService, private managementService: ManagementService) {
    super(http, appConfigService);
  }

  create(createBudgetDTO: CreateBudgetDto): Promise<CreateBudgetResponseDTO> {
    return this.managementService.createManagementBudget(this.mapOtaBudgetToManagementBudget(createBudgetDTO));
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
}
