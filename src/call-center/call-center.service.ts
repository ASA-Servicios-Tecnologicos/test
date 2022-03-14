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
  ) {}

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
    const budget = await this.budgetService.findById(dossierId);
    const booking = await this.bookingService.findByDossier(dossierId);
    const checkout = await this.bookingService.getRemoteCheckout(booking.checkoutId);
    checkout.payment.installments = checkout.payment.installments.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA > dateB ? 1 : -1;
    });
    const flights = [
      ...[
        ...budget.services[0].flight.map((flight) => {
          return [
            flight.flight_booking_segment.map((segment) => {
              return {
                departureAirportCode: segment.departure,
                arrivalAirportCode: segment.arrival,
                departureDate: segment.departure_at,
                arrivalDate: segment.arrival_at,
              };
            }),
          ];
        }),
      ],
    ];
    const data = {
      buyerName: `${budget.client.final_name}`,
      reference: budget.services[0].locator ?? 'Pendiente',
      pricePerPerson: checkout.payment.amount.value / checkout.passengers.length,
      personsNumber: checkout.passengers.length,
      amount: checkout.payment.amount.value,
      currency: checkout.payment.amount.currency,
      payments: checkout.payment.installments,
      packageName: booking.packageName,
      flights: flights,
      transfers: budget.services[0].raw_data.transfers,
      passengers: checkout.passengers,
      cancellationPollicies: budget.services[0].raw_data.cancellationPolicyList,
      insurances: budget.services[0].raw_data.insurances,
      observations: budget.services[0].raw_data.observations,
      hotelRemarks: budget.services[0].hotels[0].raw_data.remarks,
    };
    const email = await this.notificationsService.sendConfirmationEmail(data, budget.client.email);
    if (email.status === HttpStatus.OK) {
      return { status: email.status, message: email.statusText };
    } else {
      throw new HttpException({ message: email.statusText, error: email.statusText }, email.status);
    }
  }

  async cancelDossier(dossierId: string) {
    const booking = await this.bookingService.findByDossier(dossierId);
    this.dossiersService.patchDossierById(Number(dossierId), {
      dossier_situation: 5,
      observation: 'El expendiente ha sido cancelado',
    });
    return this.checkoutService.cancelCheckout(booking.checkoutId);
  }

  private mapFilterParamsToQueryParams(filterParams: CallCenterBookingFilterParamsDTO): string {
    let result = '?';

    Object.keys(filterParams).forEach((key, index) => {
      result += `${key}=${filterParams[key]}${Object.keys(filterParams)[index + 1] ? '&' : ''}`;
    });

    return encodeURI(result);
  }
}
