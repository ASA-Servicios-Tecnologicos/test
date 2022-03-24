import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { pickBy } from 'lodash';
import { BookingService } from 'src/booking/booking.service';
import { BudgetService } from 'src/budget/budget.service';
import { CheckoutService } from 'src/checkout/services/checkout.service';
import { NotificationService } from 'src/notifications/services/notification.service';
import { AppConfigService } from '../configuration/configuration.service';
import { DossiersService } from '../dossiers/dossiers.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { CallCenterBookingFilterParamsDTO, GetDossiersByClientDTO } from '../shared/dto/call-center.dto';

@Injectable()
export class CallCenterService {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly managementHttpService: ManagementHttpService,
    private readonly dossiersService: DossiersService,
    private readonly budgetService: BudgetService,
    private readonly bookingService: BookingService,
    private readonly notificationsService: NotificationService,
    private readonly checkoutService: CheckoutService,
  ) { }

  getDossiersByAgencyId(agencyId: string, filterParams: CallCenterBookingFilterParamsDTO) {
    // return { ...managementDossierByAgency, results };
    return this.managementHttpService.get<GetDossiersByClientDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/agency/${agencyId}/dossier/${this.mapFilterParamsToQueryParams(
        pickBy(filterParams),
      )}`,
    );
  }

  patchDossierById(id: number, newDossier) {
    return this.dossiersService.patchDossierById(id, newDossier);
  }

  async sendConfirmationEmail(dossierId: string) {
    const dossier = await this.dossiersService.findDossierById(dossierId);
    const booking = await this.bookingService.findByDossier(dossierId);
    let checkout = undefined;
    if (booking) {
      checkout = await this.bookingService.getRemoteCheckout(booking.checkoutId);
    }

    const flights = [
      ...dossier.services[0].flight.map((flight) => {
        return flight.flight_booking_segment.map((segment) => {
          return {
            departureAirportCode: segment.departure,
            arrivalAirportCode: segment.arrival,
            departureDate: segment.departure_at,
            arrivalDate: segment.arrival_at,
          };
        });
      })];
    const transfers = dossier.services[0].transfer.map(transfer => {
      return transfer.transfer_booking.map((transferBook) => {
        return {
          description: transferBook.from_name,
          dateAt: transferBook.from_date
        }
      })
    });
    const data = {
      methodType: checkout?.payment.methodType ?? 'CARD',
      dossier: dossier.code,
      buyerName: `${dossier.client.final_name}`,
      reference: dossier.services[0].locator ?? 'Pendiente',
      pricePerPerson: dossier.services[0].total_pvp / dossier.services[0].paxes.length,
      personsNumber: dossier.services[0].paxes.length,
      amount: dossier.services[0].total_pvp,
      currency: dossier.services[0].raw_data.currency,
      payments: dossier.dossier_payments?.map(payment => {
        return {
          dueDate: payment.paid_date,
          amount: {
            value: payment.paid_amount,
            currency: dossier.services[0].raw_data.currency
          },
          status: payment.status
        }
      }) ?? [],
      packageName: booking?.packageName ?? '', // Si queremos presciding de booking, de donde sacamos el packageName? 
      flights: flights[0],
      transfers: transfers[0],
      passengers: dossier.services[0].paxes?.map(passenger => {
        return {
          name: passenger.name,
          lastName: passenger.last_name,
          dob: passenger.birthdate,
          document: {
            documentType: passenger.type_document,
            documentNumber: passenger.dni,
            expeditionDate: '',
            nationality: passenger.nationality_of_id
          },
          country: passenger.nationality,
          gender: passenger.gender
        }
      }) ?? [],
      cancellationPollicies: dossier.services[0].cancellation_policies ?? [],
      insurances: dossier.services[0].raw_data.insurances,
      observations: dossier.services[0].relevant_data?.observations ?? [],
      hotelRemarks: dossier.services[0].relevant_data?.remarks?.map(remark => remark[Object.keys(remark)[0]].map(remark => { return { text: remark.text } }))[0] ?? []
    };
    const email = await this.notificationsService.sendConfirmationEmail(data, dossier.client.email);
    if (email.status === HttpStatus.OK) {
      return { status: email.status, message: email.statusText };
    } else {
      throw new HttpException({ message: email.statusText, error: email.statusText }, email.status);
    }
  }

  async cancelDossier(dossierId: string) {
    const booking = await this.bookingService.findByDossier(dossierId);
    const canceled = await this.checkoutService.cancelCheckout(booking.checkoutId);
    if (canceled.status === HttpStatus.OK) {
      await this.dossiersService.patchDossierById(Number(dossierId), {
        dossier_situation: 5,
        observation: 'El expendiente ha sido cancelado',
      });
    }
    return canceled.data;

  }

  private mapFilterParamsToQueryParams(filterParams: CallCenterBookingFilterParamsDTO): string {
    let result = '?';

    Object.keys(filterParams).forEach((key, index) => {
      result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
    });

    return encodeURI(result);
  }
}
