import { formatFullDate } from 'src/utils/utils';
import { EmailFiltersDTO, EmailObservationDTO } from './../../shared/dto/email.dto';
import { BookingService } from './../../booking/booking.service';
import { BookingServicesService } from './../../management/services/booking-services.service';
import { CheckoutService } from './../../checkout/services/checkout.service';
import { DossiersService } from './../../dossiers/dossiers.service';
import { NotificationService } from '../../notifications/services/notification.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { logger } from '../../logger';
import { ObservationsService } from '../observations/observations.service';
import { Response } from 'express';
import { buildPayments, buildCancellationPollicies, buildFlight, buildPassengers } from './utils/mails.utils';
@Injectable()
export class MailsService {
  constructor(
    private readonly dossiersService: DossiersService,
    private readonly bookingService: BookingService,
    private readonly checkoutService: CheckoutService,
    private readonly bookingServicesService: BookingServicesService,
    private readonly notificationService: NotificationService,
    private readonly observationsService: ObservationsService,
  ) {}

  async getMails(data: EmailFiltersDTO, response: Response) {
    try {
      const filters = {
        applicationName: 'booking-flowo-tecnoturis',
        ...data,
      };
      if (!data?.pagination) {
        throw new HttpException('Field pagination is requerid.', HttpStatus.BAD_REQUEST);
      }
      const mail = await this.notificationService.getMailsRaw(filters);

      return response.status(mail.status).send(mail.data);
    } catch (error) {
      logger.error(`[MailsService] [getMails] ${error.stack}`);
      return response.status(HttpStatus.CONFLICT).send(error?.message);
    }
  }

  async sendCancelation(data: any, response: Response) {
    try {
      const dossier = await this.dossiersService.findDossierById(data.dossierId);

      if (dossier.services[0].provider_status !== 'CANCELLED') {
        return response.status(HttpStatus.CONFLICT).send('the reservation is not canceled.');
      }

      const priceHistory = await this.bookingServicesService.getPriceHistory({ booking_service: dossier.services[0].id });
      // console.log('dossier ', dossier);
      const booking = await this.bookingService.findByDossier(data.dossierId);
      // console.log('booking ', booking);
      const checkout = await this.checkoutService.getCheckout(booking.checkoutId);
      // console.log('checkout ', checkout);
      // const dataContentApi = await this.bookingServicesService.getInformationContentApi(booking.hotelCode);
      // console.log('dataContentApi ', dataContentApi);

      //aca se ponen las variables que se mostraran en el mensaje
      const contentInfo: any = {
        locator: dossier.services[0].locator,
        code: dossier.code,

        buyerName: dossier.client.name,
        ...buildPayments(priceHistory, dossier.dossier_payments, dossier.services[0]),
        packageName: booking.packageName,
        ...buildFlight(dossier.services[0].flight),
        cancellationPollicies: buildCancellationPollicies(dossier.services[0].cancellation_policies),
        ...buildPassengers(checkout.passengers),
      };

      const confimation = await this.notificationService.sendCancelation(dossier.client.email, contentInfo);

      console.log('confimation ', confimation.data);
      return response.status(HttpStatus.OK).send('Email sent.');
    } catch (error) {
      logger.error(`[MailsService] [sendCancelation] ${error.stack}`);
      return response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async sendObservation(data: EmailObservationDTO, response: Response) {
    try {
      const dossier = await this.dossiersService.findDossierById(data.dossierId);
      // console.log('dossier ', dossier);
      const booking = await this.bookingService.findByDossier(data.dossierId);
      // console.log('booking ', booking);
      const checkout = await this.checkoutService.getCheckout(booking.checkoutId);
      //console.log('checkout ', checkout);
      // const dataContentApi = await this.bookingServicesService.getInformationContentApi(booking.hotelCode);
      // console.log('dataContentApi ', dataContentApi);

      // const observations = await this.observationsService.getObservations({ dossier: data.dossierId, type: '1' });
      // console.log('observations ', observations);

      //aca se ponen las variables que se mostraran en el mensaje
      const contentInfo: any = {
        locator: dossier.services[0].locator,
        status: dossier.services[0].provider_status === 'CANCELLED' ? true : false,
        code: dossier.code,
        buyerName: dossier.client.name,
        observation: data.observation,
        dateSend: formatFullDate(new Date().toString()),
        packageName: booking.packageName,
        ...buildFlight(dossier.services[0].flight),
        ...buildPassengers(checkout.passengers),
      };
      const confimation = await this.notificationService.sendObservation(dossier.client.email, contentInfo);
      console.log('confimation.data ', confimation.data);
      return response.status(HttpStatus.OK).send('Email sent.');
    } catch (error) {
      logger.error(`[MailsService] [sendObservation] ${error.stack}`);
      return response.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
