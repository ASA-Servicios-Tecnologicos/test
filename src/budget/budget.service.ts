import { HttpService, Injectable } from '@nestjs/common';
import { lastValueFrom, map, Observable, of } from 'rxjs';
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
    return this.createManagementBudget(this.mapOtaBudgetToManagementBudget(createBudgetDTO));
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
    const createManagementBudgetDto: CreateManagementBudgetDto = {
      client: 822, // TODO: Add or get client business logic,
      packageData: [createBudgetDTO.preBookings], // "packageData" is "preBooking" model in frontend
    };
    return createManagementBudgetDto;
  }

  private async createManagementBudget(createManagementBudgetDto: CreateManagementBudgetDto): Promise<CreateBudgetResponseDTO> {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const token = await this.managementService.auth();

    const result = await lastValueFrom(
      this.http.post(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/booking/budget/`, createManagementBudgetDto, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    return result.data;
  }
}
