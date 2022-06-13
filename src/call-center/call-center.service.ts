import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { pickBy } from 'lodash';
import { BookingService } from '../booking/booking.service';
import { BudgetService } from '../budget/budget.service';
import { CheckoutService } from '../checkout/services/checkout.service';
import { BookingServicesService } from '../management/services/booking-services.service';
import { NotificationService } from '../notifications/services/notification.service';
import { PaymentsService } from '../payments/payments.service';
import { CreateUpdateDossierPaymentDTO } from '../shared/dto/dossier-payment.dto';
import { DossierPaymentMethods } from '../shared/dto/email.dto';
import t from 'typy';
import { AppConfigService } from '../configuration/configuration.service';
import { DossiersService } from '../dossiers/dossiers.service';
import { ManagementHttpService } from '../management/services/management-http.service';
import { CallCenterBookingFilterParamsDTO, GetBudgetsByClientDTO, GetDossiersByClientDTO } from '../shared/dto/call-center.dto';
import { logger } from '../logger';
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
    private readonly paymentsService: PaymentsService,
    private readonly bookingServicesService: BookingServicesService,
  ) {}

  getDossiersByAgencyId(agencyId: string, filterParams: CallCenterBookingFilterParamsDTO) {
    return this.managementHttpService.get<GetDossiersByClientDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/agency/${agencyId}/dossier/${this.mapFilterParamsToQueryParams(
        pickBy(filterParams),
      )}`,
    );
  }

  getBudgetsByAgencyId(agencyId: string, filterParams: CallCenterBookingFilterParamsDTO) {
    return this.managementHttpService.get<GetBudgetsByClientDTO>(
      `${this.appConfigService.BASE_URL}/management/api/v1/agency/${agencyId}/budget/${this.mapFilterParamsToQueryParams(
        pickBy(filterParams),
      )}`,
    );
  }

  patchDossierById(id: number, newDossier) {
    return this.dossiersService.patchDossierById(id, newDossier);
  }

  async sendConfirmationEmail(dossierId: string) {
    logger.info(`[CallCenterService] [sendConfirmationEmail] init method`)
    const dossier = await this.dossiersService.findDossierById(dossierId);
    const booking = await this.bookingService.findByDossier(dossierId);

    const checkout = await this.checkoutService.getCheckout(booking.checkoutId);
    if (checkout['error']) {
      logger.error(`[CallCenterService] [sendConfirmationEmail] ${checkout['error']}`)
      throw new HttpException(checkout['error']['message'], checkout['error']['status']);
    }

    let dataContentApi = await this.bookingServicesService.getInformationContentApi(booking.hotelCode).catch((error) => {
      logger.error(`[CallCenterService] [sendConfirmationEmail] ${error.stack}`)
    });
    const methodsDetails = t(checkout, 'payment.methodDetail').safeObject;

    let adults = 0;
    let kids = 0;

    dossier.services[0].paxes.forEach((p) => {
      p.type.toUpperCase() === 'ADULT' ? (adults += 1) : (kids += 1);
    });
    const flights = [
      ...dossier.services[0].flight.map((flight) => {
        return flight.flight_booking_segment.map((segment) => {
          return {
            departureAirportCode: segment.departure,
            arrivalAirportCode: segment.arrival,
            departureDate: segment.departure_at,
            arrivalDate: segment.arrival_at,
            passengers: dossier.services[0].paxes.length,
            passengers_adults: adults,
            passenger_kids: kids,
          };
        });
      }),
    ];
    const transfers = dossier.services[0].transfer.map((transfer) => {
      return transfer.transfer_booking.map((transferBook) => {
        return {
          description: transferBook.from_name,
          dateAt: transferBook.from_date,
          passengers_adults: adults,
          passenger_kids: kids,
        };
      });
    });

    const hotel = dossier.services[0].hotels[0];
    const starValue = +hotel.raw_data.category.value;
    const stars: number[] = [];
    for (let i = 1; i <= starValue; i++) {
      stars.push(i);
    }

    const data = {
      methodType: this.determinePaymentMethod(dossier.dossier_payments) ?? DossierPaymentMethods['Tarjeta de Credito'],
      dossier: dossier.code,
      buyerName: `${dossier.client.final_name}`,
      reference: dossier.services[0].locator ?? 'Pendiente',
      pricePerPerson: dossier.services[0].total_pvp / dossier.services[0].paxes.length,
      personsNumber: dossier.services[0].paxes.length,
      amount: dossier.services[0].total_pvp,
      currency: dossier.services[0].raw_data.currency,
      payments:
        dossier.dossier_payments?.map((payment) => {
          return {
            dueDate: payment.paid_date,
            amount: {
              value: payment.paid_amount,
              currency: dossier.services[0].raw_data.currency,
            },
            status: payment.status,
          };
        }) ?? [],
      packageName: booking?.packageName ?? '',
      hotelCode: booking?.hotelCode ?? '',
      contentInfo: dataContentApi !== undefined ? dataContentApi : {},
      flights: flights[0],
      transfers: transfers[0],
      passengers:
        dossier.services[0].paxes?.map((passenger) => {
          return {
            name: passenger.name,
            lastName: passenger.last_name,
            dob: passenger.birthdate,
            document: {
              documentType: passenger.type_document,
              documentNumber: passenger.dni,
              documentExpirationDate: passenger.expiration_document,
              nationality: passenger.nationality_of_id,
            },
            country: passenger.nationality,
            gender: passenger.gender,
          };
        }) ?? [],
      cancellationPollicies: dossier.services[0].cancellation_policies ?? [],
      insurances: dossier.services[0].raw_data.insurances,
      observations: dossier.services[0].relevant_data?.observations ?? [],
      methodsDetails: methodsDetails !== undefined ? methodsDetails : {},
      hotelRemarks:
        dossier.services[0].relevant_data?.remarks?.map((remark) =>
          remark[Object.keys(remark)[0]].map((r) => {
            return { text: r.text };
          }),
        )[0] ?? [],
      hotel: hotel,
      room: hotel.hotel_rooms[0],
      adults,
      kids,
      stars,
    };
    const email = await this.notificationsService.sendConfirmationEmail(data, dossier.client.email);
    if (email.status === HttpStatus.OK) {
      return { status: email.status, message: email.statusText };
    } else {
      logger.error(`[CallCenterService] [sendConfirmationEmail] --email ${email}`)
      throw new HttpException({ message: email.statusText, error: email.statusText }, email.status);
    }
  }

  async cancelDossier(dossierId: string) {
    logger.info(`[CallCenterService] [cancelDossier] init method`)
    const booking = await this.bookingService.findByDossier(dossierId);
    if (!booking) {
      logger.error(`[CallCenterService] [cancelDossier] booking with some dossier not found`)
      throw new HttpException('No se ha encontrado ningun booking con dossier ' + dossierId, HttpStatus.NOT_FOUND);
    }
    const canceled = await this.checkoutService.cancelCheckout(booking.checkoutId);
    if (canceled.status === HttpStatus.OK) {
      await this.dossiersService.patchDossierById(Number(dossierId), {
        dossier_situation: 5,
        observation: 'El expendiente ha sido cancelado',
      });
      const dossierPayments: CreateUpdateDossierPaymentDTO = {
        dossier: booking.dossier,
        bookingId: canceled.data.booking.bookingId,
        checkoutId: canceled.data.checkoutId,
        installment: canceled.data.payment.installments,
        paymentMethods: canceled.data.payment.methodType === 'CARD' ? 4 : 2,
        amount: canceled.data.payment.amount,
      };
      await this.paymentsService.updateDossierPayments(dossierPayments);
      return canceled.data;
    }
  }

  private determinePaymentMethod(payments: Array<any>) {
    if (payments?.length) {
      return DossierPaymentMethods[payments[0].payment_method];
    }
    return DossierPaymentMethods['Tarjeta de Credito'];
  }

  private mapFilterParamsToQueryParams(filterParams: CallCenterBookingFilterParamsDTO): string {
    let result = '?';

    Object.keys(filterParams).forEach((key, index) => {
      result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
    });

    return encodeURI(result);
  }
}
