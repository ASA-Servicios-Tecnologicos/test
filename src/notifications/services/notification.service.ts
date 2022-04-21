import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { EmailDTO, HTML_TEMPLATES } from '../../shared/dto/email.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from 'src/shared/services/cache.service';
import { HtmlTemplateService } from 'src/shared/services/html-template.service';

@Injectable()
export class NotificationService extends SecuredHttpService {

  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService, readonly cacheService: CacheService<any>, private readonly htmlTemplateService: HtmlTemplateService) {
    super(http, appConfigService, cacheService);
  }

  sendMailRaw(data: EmailDTO) {
    return this.postSecured(this.appConfigService.EMAIL_RAW_URL, data);
  }

  sendConfirmationEmail(data, toEmail: string) {
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
        console.error('Error al formatear políticas de cancelación: ' + error);
        return {
          ...policy,
          title: policy.text.replace('gestión', 'cancelación'),
          text: ''
        }
      }
    });
    try {
      const lowestDatePolicy = data.cancellationPollicies
        .filter((policy) => policy.amount !== 0)
        .find(
          (policy) =>
            Math.min(...data.cancellationPollicies.map((policy) => new Date(policy.fromDate).getMilliseconds())) ===
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
      console.error('Error al corregir y formatear la fecha de la primera política de cancelación: ' + error);

    }

    const template = this.htmlTemplateService.generateTemplate(HTML_TEMPLATES[data.methodType], data)
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
      metadata: { locator: locator, number_dossier: number_dossier }
    };
    return this.sendMailRaw(email);
  }
}
