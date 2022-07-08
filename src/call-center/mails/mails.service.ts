import { BookingService } from './../../booking/booking.service';
import { BookingServicesService } from './../../management/services/booking-services.service';
import { CheckoutService } from './../../checkout/services/checkout.service';
import { DossiersService } from './../../dossiers/dossiers.service';
import { NotificationService } from 'src/notifications/services/notification.service';
import { Injectable } from '@nestjs/common';
import { logger } from '../../logger';
import { ObservationsService } from '../observations/observations.service';
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

  async sendCancelation(data: any) {
    try {
      const dossier = await this.dossiersService.findDossierById(data.dossierId);
      console.log('dossier ', dossier);
      const booking = await this.bookingService.findByDossier(data.dossierId);
      console.log('booking ', booking);
      const checkout = await this.checkoutService.getCheckout(booking.checkoutId);
      console.log('checkout ', checkout);
      const dataContentApi = await this.bookingServicesService.getInformationContentApi(booking.hotelCode);
      console.log('dataContentApi ', dataContentApi);

      //aca se ponen las variables que se mostraran en el mensaje
      const contentInfo: any = {
        buyerName: dossier.client.name,
      };

      const confimation = await this.notificationService.sendCancelation(dossier.client.email, contentInfo);

      console.log('confimation ', confimation.data);
      logger.info(`[MailsService] [sendCancelation] ${confimation}`);
      return { status: 'Send.' };
    } catch (error) {
      logger.error(`[MailsService] [sendCancelation] ${error.stack}`);
      return { status: 'Not send.' };
    }
  }

  async sendObservation(data: any) {
    try {
      const dossier = await this.dossiersService.findDossierById(data.dossierId);
      console.log('dossier ', dossier);
      // const booking = await this.bookingService.findByDossier(data.dossierId);
      // console.log('booking ', booking);
      // const checkout = await this.checkoutService.getCheckout(booking.checkoutId);
      // console.log('checkout ', checkout);
      // const dataContentApi = await this.bookingServicesService.getInformationContentApi(booking.hotelCode);
      // console.log('dataContentApi ', dataContentApi);

      const observations = await this.observationsService.getObservations({ dossier: data.dossierId, type: '1' });
      console.log('observations ', observations);

      //aca se ponen las variables que se mostraran en el mensaje
      const contentInfo: any = {
        buyerName: dossier.client.name,
        observation: data.observation,
      };
      console.log('contentInfo ', contentInfo);

      const confimation = await this.notificationService.sendObservation(dossier.client.email, contentInfo);

      console.log('confimation ', confimation.data);
      logger.info(`[MailsService] [sendObservation] ${confimation}`);
      return { status: 'Send.' };
    } catch (error) {
      logger.error(`[MailsService] [sendObservation] ${error.stack}`);
      return { status: 'Not send.' };
    }
  }
}
