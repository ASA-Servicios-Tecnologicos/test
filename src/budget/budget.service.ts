import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AppConfigService } from '../configuration/configuration.service';
import { ManagementService } from '../management/services/management.service';
import { CreateBudgetDto, CreateManagementBudgetDto, ManagementBudgetDto } from '../shared/dto/budget.dto';
import { CreateBudgetResponseDTO } from '../shared/dto/create-budget-response.dto';

@Injectable()
export class BudgetService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService, private managementService: ManagementService) {}

  create(createBudgetDTO: CreateBudgetDto): Promise<CreateBudgetResponseDTO> {
    return this.createManagementBudget(this.mapOtaBudgetToManagementBudget(createBudgetDTO));
  }

  findById(id: string) {
    return this.getManagementBudgetById(id);
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

  private async getManagementBudgetById(id: string): Promise<ManagementBudgetDto> {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const token = await this.managementService.auth();

    return firstValueFrom(
      this.http.get(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/clients/dossier/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    )
      .then((res) => res.data)
      .catch((err) => {
        console.log('🚀 ~ file: budget.service.ts ~ line 63 ~ BudgetService ~ getManagementBudgetById ~ err', err.response);
        throw new HttpException(err.message, err.response.status);
      });
  }
}
