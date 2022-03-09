import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { EmailDTO } from '../../shared/dto/email.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { CacheService } from 'src/shared/services/cache.service';

@Injectable()
export class NotificationService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService, readonly cacheService: CacheService<any>) {
    super(http, appConfigService, cacheService);

    Handlebars.registerHelper('toOrdinal', function (options) {
      let index = parseInt(options.fn(this)) + 1;
      let ordinalTextMapping = [
        // unidades
        ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno'],
        // decenas
        ['', 'décimo', 'vigésimo', 'trigésimo', 'cuadragésimo', 'quincuagésimo', 'sexagésimo', 'septuagésimo', 'octagésimo', 'nonagésimo'],
      ];
      let ordinal = '';
      let digits = [...index.toString()];
      digits.forEach((digit, i) => {
        let digit_ordinal = ordinalTextMapping[digits.length - i - 1][+digit];
        if (!digit_ordinal) return;

        ordinal += digit_ordinal + ' ';
      });
      return ordinal.trim();
    });

    Handlebars.registerHelper('paymentStatus', function (options) {
      let status = options.fn(this);
      return status === 'COMPLETED' ? 'Pagado' : '';
    });

    Handlebars.registerHelper('paymentStausIcon', function (status, options) {
      return status === 'COMPLETED' ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('capitalizeFirstLetter', function (options) {
      let str = options.fn(this).trim();
      return str.charAt(0).toUpperCase() + str.slice(1);
    });

    Handlebars.registerHelper('formatdate', function (date) {
      let splitedDate = date.split('-');
      splitedDate = splitedDate.reverse();
      return splitedDate.join('/');
    });

    Handlebars.registerHelper('formatPrice', function (price, currency) {
      if (currency) {
        return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, style: 'currency', currency: currency }).format(price);
      } else {
        return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(price);
      }
    });

    Handlebars.registerHelper('formatFullDate', function (stringDate) {
      const date = new Date(stringDate);
      return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    });

    Handlebars.registerHelper('formatHourDate', function (stringDate) {
      const date = new Date(stringDate);
      return new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric' }).format(date);
    });

    Handlebars.registerHelper('fullName', function (passenger) {
      return `${passenger.gender === 'MALE' ? 'Sr.' : passenger.gender === 'FEMALE' ? 'Sra.' : ''} ${passenger.name} ${passenger.lastname}`;
    });
  }

  sendMailRaw(data: EmailDTO) {
    return this.postSecured(this.appConfigService.EMAIL_RAW_URL, data);
  }

  sendConfirmationEmail(data, toEmail: string) {
    const formatDatesCancellationPollicies = function (text: string) {
      const findings = text.match(/(\d{1,4}([.\--])\d{1,2}([.\--])\d{1,4})/g);
      if (findings) {
        findings.forEach((finding) => {
          let splitedDate = finding.split('-');
          splitedDate = splitedDate.reverse();
          text = text.replace(finding, splitedDate.join('/'));
        });
      }
      return text;
    };
    data.cancellationPollicies = data.cancellationPollicies.map((policy) => {
      return {
        ...policy,
        title: policy.text.split('.')[0].replace('gestión', 'cancelación'),
        text: formatDatesCancellationPollicies(policy.text.split('.')[1]).replace('gestión', 'cancelación'),
      };
    });
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

    let flowo_email_confirmation = readFileSync('src/notifications/templates/flowo_email_confirmation.hbs', 'utf8');
    let template = Handlebars.compile(flowo_email_confirmation);
    let emailTemplate = template(data);
    const email: EmailDTO = {
      uuid: uuidv4(),
      applicationName: 'booking-flowo-tecnoturis',
      from: 'noreply@mg.flowo.com',
      to: [toEmail],
      subject: 'Enhorabuena, tu viaje con Flowo ha sido confirmado',
      body: emailTemplate,
      contentType: 'HTML',
    };
    return this.sendMailRaw(email);
  }
}
