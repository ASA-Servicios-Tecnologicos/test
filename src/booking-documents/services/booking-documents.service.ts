import { HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../logger';
import { ManagementHttpService } from '../../management/services/management-http.service';
import { NotificationService } from '../../notifications/services/notification.service';
import { GetDocuments, DocumentsDTO } from '../../shared/dto/booking-documents.dto';
import { CheckoutContact } from '../../shared/dto/checkout.dto';
import { CheckoutBuyer } from '../../shared/dto/checkout.dto';
import { EmailDTO } from '../../shared/dto/email.dto';
@Injectable()
export class BookingDocumentsService {
  constructor(
    private readonly managementHttp: ManagementHttpService,
    private readonly appConfigService: AppConfigService,
    private readonly notificationsService: NotificationService,
  ) {}

  private findDocumentsByBooking(brandCode: string, bookingReference: string) {
    const body: GetDocuments = {
      brandCode: brandCode,
      bookingId: bookingReference,
      typeVoucher: 'client',
    };
    return this.managementHttp.post<DocumentsDTO>(`${this.appConfigService.BASE_URL}/packages-providers/api/v1/voucher/`, body);
  }

  async sendBonoEmail(dosierCode: string, brandCode: string, locator: string, contact: CheckoutContact, buyer: CheckoutBuyer) {
    logger.info(`[BookingDocumentsService] [sendBonoEmail] sendBonoEmail`)
    const bonoDocuments = await this.findDocumentsByBooking(brandCode, locator).catch((error) => { 
      logger.error(`[BookingDocumentsService] [sendBonoEmail] ${error.stack}`)
      return error
    });
    if (bonoDocuments.status === HttpStatus.OK) {
      const email: EmailDTO = {
        uuid: uuidv4(),
        applicationName: 'booking-flowo-tecnoturis',
        from: 'noreply@mg.flowo.com',
        to: [contact.email],
        subject: `Te enviamos la documentación de tu reserva ${dosierCode}`,
        body: `
        Documentación de tu reserva
        \n
        Estimado/a ${buyer.name}
        \n
        Te adjuntamos en este email la documentación que tienes que imprimir y presentar para la prestación de los servicios.
        \n
        Titular: ${buyer.name} ${buyer.lastname} Reserva: ${dosierCode}
        \n
        Desde Flowo esperamos que disfrutes al máximo la experiencia.`,
        contentType: 'TEXT',
        urlAttachments: bonoDocuments.data.map((document) => {
          return {
            filename: document.filename,
            url: document.url,
          };
        }),
      };
      this.notificationsService.sendMailRaw(email);
    }
  }
}
