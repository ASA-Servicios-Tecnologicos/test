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

import { PaymentsService } from '../../payments/payments.service';
import { DossierDto } from './../../shared/dto/dossier.dto';
import { DossiersService } from '../../dossiers/dossiers.service';
import { CheckoutService } from './../../checkout/services/checkout.service';
import { CreateDossierPaymentDTO, DossierPaymentInstallment } from './../../shared/dto/dossier-payment.dto';
import { InfoDossierPayments } from '../../shared/dto/dossier-payment.dto';

import { logger } from '../../logger';
@Injectable()
export class BookingServicesService {
  constructor(private readonly managementHttpService: ManagementHttpService, 
    private readonly appConfigService: AppConfigService,
    private readonly paymentsService: PaymentsService,
    private readonly checkoutService: CheckoutService,
    private readonly dossiersService: DossiersService
    ) {}

  getBookingServicesByDossierId(dossierId: string): Promise<ManagementBookingServicesByDossierDTO[]> {
    return this.managementHttpService.get<ManagementBookingServicesByDossierDTO[]>(
      `${this.appConfigService.BASE_URL}/management/api/v1/clients/dossier/${dossierId}/booking-service/`,
    );
  }

  async getBookingServiceById(id: string, force: string = 'false', headers?: HeadersDTO): Promise<ManagementBookingServiceDTO> {

    const data = await this.managementHttpService.get<ManagementBookingServiceDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/booking-service/${id}/?force=${force}`, { headers }
    );


    

    if(data.provider_status == 'CANCELLED' ){

      let new_amount= 0;

      const infoDossierPayments: InfoDossierPayments = await this.paymentsService.getDossierPayments((data.dossier.id).toString());
      //Falta cambiar el de arriba por el de abajo para obtener la informacion completa de un dossier
      const dossier: DossierDto = await this.dossiersService.findDossierById((data.dossier.id).toString());

      const filteredPayments: DossierPaymentInstallment[] = infoDossierPayments.dossier_payments.filter(x => {

        if( x.status == 'COMPLETED' || x.status == 'COMPLETED_AGENT'){
          new_amount= new_amount  + new_amount;
        }

        return x.status!= 'COMPLETED' && x.status!= 'COMPLETED_AGENT' && x.status!= 'ERROR' && x.status!= 'CANCELLED' 
      });

      if ( filteredPayments.length > 0 ){
        logger.info(`[BookingServicesService] [getBookingServiceById]  payments cancelled for ${data.dossier.id}`);

        const checkoutId = await this.checkoutService.getCheckoutByDossierId(data.dossier.id)
        this.checkoutService.cancelCheckout(checkoutId);
        this.paymentsService.updateDossierPaymentsByCheckout(checkoutId)
      }


      //aqui se llama a crear pago con la logica de total pagos obtenidos del dossier

      const amount =  dossier.services[0].total_pvp - (new_amount)
      let newPayment: CreateDossierPaymentDTO = {
        dossier_id: data.dossier.id,

        paid_amount: amount,
        status_id: 3,

        //paid_date:  'string',
        is_update: true,
        
        //payment_method_id: 1,
        //observation: 'rer',
        //manual_charge_date: null
      }

      this.paymentsService.createDossierPaymentByAgente(newPayment);

    }


    return data;

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
