import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { EmailDTO, EmailFiltersDTO, HTML_TEMPLATES, TypeEmail } from '../../shared/dto/email.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../logger';
import { CacheService } from '../../shared/services/cache.service';
import { HtmlTemplateService } from '../../shared/services/html-template.service';

@Injectable()
export class NotificationService extends SecuredHttpService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    readonly cacheService: CacheService<any>,
    private readonly htmlTemplateService: HtmlTemplateService,
  ) {
    super(http, appConfigService, cacheService);
  }

  getMailsRaw(data: EmailFiltersDTO) {
    return this.postSecured(`${this.appConfigService.W2M_URL}/integration/notificator-persistence/api/v1/email/find`, data);
  }

  sendMailRaw(data: EmailDTO) {
    return this.postSecured(this.appConfigService.EMAIL_RAW_URL, data);
  }

  sendConfirmationEmail(data, toEmail: string) {
    logger.info(`[NotificationService] [sendConfirmationEmail] init method`);
    const formatDatesCancellationPollicies = function (text: string) {
      const findings = text?.match(/(\d{1,4}([.\--])\d{1,2}([.\--])\d{1,4})/g);
      if (findings) {
        findings.forEach((finding) => {
          let splitedDate = finding.split('-');
          splitedDate = splitedDate.reverse();
          text = text.replace(finding, splitedDate.join('/'));
        });
      }
      return text;
    };
    data.cancellationPollicies = data.cancellationPollicies?.map((policy) => {
      try {
        const dotIndex = policy.text?.indexOf('.');
        if (dotIndex > -1 && policy.text.length != dotIndex) {
          return {
            ...policy,
            title: policy.text.split('.')[0].replace('gestión', 'cancelación'),
            text: formatDatesCancellationPollicies(policy.text.split('.')[1]).replace('gestión', 'cancelación'),
          };
        } else {
          return {
            ...policy,
            title: policy.text.replace('gestión', 'cancelación'),
            text: '',
          };
        }
      } catch (error) {
        logger.error(`[NotificationService] [sendConfirmationEmail] Error formatting cancellation policies ${error.stack}`);
        return {
          ...policy,
          title: policy.text.replace('gestión', 'cancelación'),
          text: '',
        };
      }
    });
    try {
      const lowestDatePolicy = data.cancellationPollicies
        .filter((policy) => policy.amount !== 0)
        .find(
          (policy) =>
            Math.min(...data.cancellationPollicies.map((cancellationPolicy) => new Date(cancellationPolicy.fromDate).getMilliseconds())) ===
            new Date(policy.fromDate).getMilliseconds(),
        );
      const noExpensesPolicy = data.cancellationPollicies.findIndex((policy) => policy['title'].includes('cancelación'));
      if (noExpensesPolicy > -1) {
        const datesInText = data.cancellationPollicies[noExpensesPolicy].text.match(/(\d{1,4}([.\/-])\d{1,2}([.\/-])\d{1,4})/g);
        const date = new Date(lowestDatePolicy.fromDate);
        date.setDate(date.getDate() - 1);
        if (datesInText) {
          data.cancellationPollicies[noExpensesPolicy].text = data.cancellationPollicies[noExpensesPolicy].text.replace(
            datesInText[1],
            new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date),
          );
        }
      }
    } catch (error) {
      logger.error(
        `[NotificationService] [sendConfirmationEmail] Error correcting and formatting the date of the first cancellation policy ${error.stack}`,
      );
    }

    data.hotelAddress = data.contentInfo.address || data.hotel.address;
    data.hotelDescription = data.contentInfo.description || '';
    data.roomCategory =
      data.room.rates && data.room.rates.length && data.room.rates[0].category ? data.room.rates[0].category : data.room.regimen_text;

    const template = this.htmlTemplateService.generateTemplate(HTML_TEMPLATES[data.methodType], data);
    const locator = data.reference;
    const number_dossier = data.dossier;

    const email: EmailDTO = {
      uuid: uuidv4(),
      applicationName: 'booking-flowo-tecnoturis',
      from: 'noreply@mg.flowo.com',
      to: [toEmail],
      subject: 'Enhorabuena, tu viaje con Flowo ha sido confirmado',
      body: template,
      contentType: 'HTML',
      metadata: { locator: locator, number_dossier: number_dossier, type: TypeEmail.CONFIRMATION },
    };
    return this.sendMailRaw(email);
  }

  sendNewsletterConfirmation(email) {
    logger.info(`[NotificationService] [sendNewsletterConfirmation] init method`);
    const template = this.htmlTemplateService.generateTemplate(HTML_TEMPLATES['CONFIRM_NEWSLETTER'], '');
    const emailData: EmailDTO = {
      uuid: uuidv4(),
      applicationName: 'booking-flowo-tecnoturis',
      from: 'noreply@mg.flowo.com',
      to: [email],
      subject: '¡Gracias por unirte a la newsletter de Flowo!',
      body: template,
      contentType: 'HTML',
    };

    return this.sendMailRaw(emailData);
  }

  sendCancelation(email: string, data: any) {
    logger.info(`[NotificationService] [sendCancelation] init method`);
    const template = this.htmlTemplateService.generateTemplate(HTML_TEMPLATES['CANCELATION_BOOKING'], data);
    const emailData: EmailDTO = {
      uuid: uuidv4(),
      applicationName: 'booking-flowo-tecnoturis',
      from: 'noreply@mg.flowo.com',
      to: [email],
      subject: '¡Tu reserva ha sido cancelada!',
      body: template,
      contentType: 'HTML',
      metadata: { locator: data.locator, number_dossier: data.code, type: TypeEmail.CANCELATION },
    };

    return this.sendMailRaw(emailData);
  }

  sendObservation(email: string, data: any) {
    logger.info(`[NotificationService] [sendObservation] init method`);
    const template = this.htmlTemplateService.generateTemplate(HTML_TEMPLATES['SEND_OBSERVATION'], data);
    const emailData: EmailDTO = {
      uuid: uuidv4(),
      applicationName: 'booking-flowo-tecnoturis',
      from: 'noreply@mg.flowo.com',
      to: [email],
      subject: '¡Tienes una nueva notificación!',
      body: template,
      contentType: 'HTML',
      metadata: { locator: data?.locator, number_dossier: data?.code, observation_id: data?.observation_id, type: TypeEmail.OBSERVATION },
    };

    return this.sendMailRaw(emailData);
  }
}
