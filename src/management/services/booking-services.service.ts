import { HeadersDTO } from './../../shared/dto/header.dto';
import { Injectable } from '@nestjs/common';
import { ContentAPI } from 'src/shared/dto/content-api.dto';
import { AppConfigService } from '../../configuration/configuration.service';
import {
  AddPassengerFlightDto,
  AddPassengerTransferDto,
  ManagementBookingServiceDTO,
  ManagementBookingServicesByDossierDTO,
} from '../../shared/dto/booking-service.dto';
import { CreateTransferDTO, CreateUpdateBookingServicePax, Pax, TransferDTO } from '../../shared/dto/call-center.dto';
import { CreateFlightDTO, FlightDTO } from '../../shared/dto/call-center.dto';
import { ManagementHttpService } from './management-http.service';

@Injectable()
export class BookingServicesService {
  constructor(private readonly managementHttpService: ManagementHttpService, private readonly appConfigService: AppConfigService) {}

  getBookingServicesByDossierId(dossierId: string): Promise<ManagementBookingServicesByDossierDTO[]> {
    return this.managementHttpService.get<ManagementBookingServicesByDossierDTO[]>(
      `${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${dossierId}/booking-service/`,
    );
  }

  getBookingServiceById(id: string, force: string = 'false'): Promise<ManagementBookingServiceDTO> {
    return this.managementHttpService.get<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/?force=${force}`,
    );
  }

  createBookingService(createBookingServiceDTO) {
    return this.managementHttpService.post<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/`,
      createBookingServiceDTO,
    );
  }

  patchBookingServiceById(
    id: number,
    managementDossierServiceDTO: Partial<ManagementBookingServiceDTO>,
    headers?: HeadersDTO
  ): Promise<ManagementBookingServiceDTO> {
    return this.managementHttpService.patch<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/`,
      managementDossierServiceDTO, { headers }
    );
  }

  deleteBookingServiceById(id: number) {
    return this.managementHttpService.delete(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/`);
  }

  createBookingServicePax(serviceId: string, createBookingServicePaxDTO: Partial<CreateUpdateBookingServicePax>, headers?: HeadersDTO): Promise<Pax> {
    return this.managementHttpService.post<Pax>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/pax/`,

      { ...createBookingServicePaxDTO, booking_service: +serviceId }, { headers }
    );
  }

  deleteBookingServicePaxById(paxId: number, headers?: HeadersDTO): Promise<void> {
    return this.managementHttpService.delete(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/pax/${paxId}/`, { headers });
  }

  putBookingServiceByServiceAndPaxId(paxId: string, newPax: Partial<CreateUpdateBookingServicePax>, headers?: HeadersDTO): Promise<void> {
    return this.managementHttpService.put(`${this.appConfigService.BASE_URL}/management/api/v1/pax/${paxId}/`, newPax, { headers } );
  }

  createFlightBookingService(flightBookingServiceId: number, createFlightDTO: CreateFlightDTO): Promise<FlightDTO> {
    return this.managementHttpService.post<FlightDTO>(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/flight/`, {
      ...createFlightDTO,
      flight_booking_service: flightBookingServiceId,
    });
  }

  deleteFlightSegmentById(flightSegmentId: number): Promise<void> {
    return this.managementHttpService.delete(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/flight/${flightSegmentId}/`,
    );
  }

  putFlightSegmentById(flightSegmentId: number, newFlightSegment: CreateFlightDTO) {
    return this.managementHttpService.put(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/flight/${flightSegmentId}/`,
      newFlightSegment,
    );
  }

  addPassengerToFlight(body: AddPassengerFlightDto) {
    return this.managementHttpService.post(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/booking-flight-pax/`, body);
  }

  deletePassengerFromFlight(id: string) {
    return this.managementHttpService.delete(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/booking-flight-pax/${id}/`,
    );
  }

  addPassengerToTransfer(body: AddPassengerTransferDto) {
    return this.managementHttpService.post(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/booking-transfer-pax/`,
      body,
    );
  }

  deletePassengerFromTransfer(id: string) {
    return this.managementHttpService.delete(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/booking-transfer-pax/${id}/`,
    );
  }

  createTransferBookingService(transferBookingServiceId: number, createTransferDTO: CreateTransferDTO): Promise<TransferDTO> {
    return this.managementHttpService.post<TransferDTO>(`${this.appConfigService.BASE_URL}/management/api/v1/booking-service/transfer/`, {
      ...createTransferDTO,
      transfer_booking_service: transferBookingServiceId,
    });
  }

  deleteTransferSegmentById(transferSegmentId: number): Promise<void> {
    return this.managementHttpService.delete(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/transfer/${transferSegmentId}/`,
    );
  }

  putTransferSegmentById(transferSegmentId: number, newTransferSegment: Partial<CreateTransferDTO>) {
    return this.managementHttpService.put(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/transfer/${transferSegmentId}/`,
      newTransferSegment,
    );
  }

  getInformationContentApi(hotelCode: string): Promise<ContentAPI> {
    return this.managementHttpService.get<ContentAPI>(
      `${this.appConfigService.CONTENT_URL}/hotels/${hotelCode}?codeType=JP&locale=es&origin=JP&path=flowo&imgSize=fullHd`,
    );
  }
}
