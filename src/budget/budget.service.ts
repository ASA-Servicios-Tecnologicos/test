import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from '../configuration/configuration.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { ClientService } from '../management/services/client.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { ManagementBookingServiceDTO, ManagementBookingServicesByDossierDTO } from '../shared/dto/booking-service.dto';
import { BudgetDto, CreateBudgetDto, CreateManagementBudgetDto, ManagementBudgetDto } from '../shared/dto/budget.dto';
import { CreateBudgetResponseDTO } from '../shared/dto/create-budget-response.dto';
import { ManagementClientDTO } from '../shared/dto/management-client.dto';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class BudgetService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    private managementHttpService: ManagementHttpService,
    private readonly bookingServicesService: BookingServicesService,
    private readonly clientService: ClientService,
    private readonly _bookingService: BookingService,
  ) {}

  async create(createBudgetDTO: CreateBudgetDto): Promise<CreateBudgetResponseDTO> {
    return this.createManagementBudget(await this.mapOtaBudgetToManagementBudget(createBudgetDTO));
  }

  findById(id: string) {
    return this.getManagementBudgetById(id);
  }

  /**
   * Maps OTA budgate to Management Budget DTO
   * @param createBudgetDTO
   * @returns
   */
  private async mapOtaBudgetToManagementBudget(createBudgetDTO: CreateBudgetDto): Promise<CreateManagementBudgetDto> {
    const clienId = await this._bookingService.getClientOrCreate(createBudgetDTO.client);
    const createManagementBudgetDto: CreateManagementBudgetDto = {
      client: clienId,
      packageData: [createBudgetDTO.preBookings], // "packageData" is "preBooking" model in frontend
    };
    return createManagementBudgetDto;
  }

  private async createManagementBudget(createManagementBudgetDto: CreateManagementBudgetDto): Promise<CreateBudgetResponseDTO> {
    return this.managementHttpService.post(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking/budget/`,
      createManagementBudgetDto,
    );
  }

  private async getManagementBudgetById(id: string): Promise<BudgetDto> {
    const managementBudgetDTO: ManagementBudgetDto = await this.managementHttpService.get<ManagementBudgetDto>(
      `${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${id}/`,
    );

    const managementBookingServicesByDossierDTO: ManagementBookingServicesByDossierDTO[] =
      await this.bookingServicesService.getBookingServicesByDossierId(id);
    const managementBookingServicesDetailedDTO: ManagementBookingServiceDTO[] = await Promise.all(
      managementBookingServicesByDossierDTO.map((managementBookingServiceByDossierDTO: ManagementBookingServicesByDossierDTO) => {
        return this.bookingServicesService.getBookingServiceById(`${managementBookingServiceByDossierDTO.id}`);
      }),
    );

    const managementClientDTO: ManagementClientDTO = await this.clientService.getClientById(`${managementBudgetDTO.client.id}`);

    const budget: BudgetDto = { ...managementBudgetDTO, client: managementClientDTO, services: managementBookingServicesDetailedDTO };
    return budget;
  }
}
