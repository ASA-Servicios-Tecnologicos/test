import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { ClientSession } from 'mongoose';
import { concatMap, firstValueFrom, lastValueFrom, of } from 'rxjs';
import { AppConfigService } from '../configuration/configuration.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { ClientService } from '../management/services/client.service';
import { ManagementService } from '../management/services/management.service';
import { BudgetDto, CreateBudgetDto, CreateManagementBudgetDto, ManagementBudgetDto } from '../shared/dto/budget.dto';
import { CreateBudgetResponseDTO } from '../shared/dto/create-budget-response.dto';
import { ManagementClientDTO } from '../shared/dto/management-client.dto';

@Injectable()
export class BudgetService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    private managementService: ManagementService,
    private readonly bookingServicesService: BookingServicesService,
    private readonly clientService: ClientService,
  ) {}

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

  private async getManagementBudgetById(id: string): Promise<BudgetDto> {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    const token = await this.managementService.auth();

    // GET Management Budget
    return firstValueFrom(
      this.http.get<ManagementBudgetDto>(`${this.appConfigService.TECNOTURIS_URL}/management/api/v1/clients/dossier/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }),
    )
      .then((responseManagementBudget) => {
        // GET Booking Services associated
        return (
          this.bookingServicesService
            .getBookingServicesByDossierId(id)
            .then((bookingServices) => {
              console.log('🚀 ~ file: budget.service.ts ~ line 78 ~ BudgetService ~ .then ~ bookingServices', bookingServices);
              //   const x = bookingServices.map(())
              return responseManagementBudget.data;
            })
            // GET Client's budget info
            .then((responseBookingServices) => {
              return this.clientService.getClientById(`${responseManagementBudget.data.client}`).then((managementClientDto) => {
                const budget: BudgetDto = { ...responseManagementBudget.data, client: managementClientDto };
                return budget;
              });
            })
        );
      })
      .catch((err) => {
        throw new HttpException(err.message, err.response.status);
      });
  }
}
