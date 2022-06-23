import { Injectable } from "@nestjs/common";
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';

@Injectable()
export class HtmlTemplateService {
    constructor() {

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
            if (date) {
                let splitedDate = date.split('-');
                splitedDate = splitedDate.reverse();
                return splitedDate.join('/');
            }
        });

        Handlebars.registerHelper('formatPrice', function (price, currency) {
            if (currency) {
                return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, style: 'currency', currency: currency }).format(price);
            } else {
                return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2 }).format(price);
            }
        });

        Handlebars.registerHelper('formatFullDate', function (stringDate) {
            if (!isNaN(Date.parse(stringDate))) {
                const date = new Date(stringDate);
                return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
            }

        });

        Handlebars.registerHelper('formatHourDate', function (stringDate) {
            if (!isNaN(Date.parse(stringDate))) {
                const date = new Date(stringDate);
                return new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric' }).format(date);
            }
        });

        Handlebars.registerHelper('fullName', function (passenger) {
            //return `${passenger.gender === 'MALE' ? 'Sr.' : passenger.gender === 'FEMALE' ? 'Sra.' : ''} ${passenger.name} ${passenger.lastname}`;
            return `${passenger.name} ${passenger.lastname}`;
        });

        Handlebars.registerHelper('isUniquePayment', function (payments, options) {
            if (payments.length === 1) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('moreThanOnePayment', function (payments, options) {
            if (payments.length > 1) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        Handlebars.registerHelper('normalizeIndex', function (index) {
            return index + 1;
        });
    }


    generateTemplate(templatePath: string, data) {
        const file = readFileSync(templatePath, 'utf8');
        const template = Handlebars.compile(file);
        let emailTemplate = template(data);
        return emailTemplate;
    }

    testTemplate() {
        let data = { dossier: '4548454845', methodType: 'BANK_TRANSFER', "buyerName": "Dani Nieto", "reference": "Pendiente", "pricePerPerson": 1226.6666666666667, "personsNumber": 3, "amount": 3680, "currency": "EUR", "payments": [{ "dueDate": "2022-03-17", "amount": { "value": 368, "currency": "EUR" }, "recurrent": false, "status": "COMPLETED", "orderCode": "7d008c61-264b-4ea3-bde9-5c6c0e5eeadc-0" }, { "dueDate": "2022-07-16", "amount": { "value": 552, "currency": "EUR" }, "recurrent": true, "status": "PENDING", "orderCode": "7d008c61-264b-4ea3-bde9-5c6c0e5eeadc-1" }, { "dueDate": "2022-07-21", "amount": { "value": 920, "currency": "EUR" }, "recurrent": true, "status": "PENDING", "orderCode": "7d008c61-264b-4ea3-bde9-5c6c0e5eeadc-2" }, { "dueDate": "2022-07-24", "amount": { "value": 1840, "currency": "EUR" }, "recurrent": true, "status": "PENDING", "orderCode": "7d008c61-264b-4ea3-bde9-5c6c0e5eeadc-3" }], "packageName": "Playa Mujeres y Costa Mujeres - Absolut", "flights": [{ "departureAirportCode": "MAD", "arrivalAirportCode": "HAV", "departureDate": "2022-08-03T14:00:00", "arrivalDate": "2022-08-03T17:30:00" }, { "departureAirportCode": "HAV", "arrivalAirportCode": "MAD", "departureDate": "2022-08-10T19:30:00", "arrivalDate": "2022-08-11T12:30:00" }], "transfers": [{ "description": "Traslado Aeropuerto Habana - Hotel en Varadero(Aeropuerto / Roc Varadero)", "dateAt": "2022-08-03" }, { "description": "Traslado Hotel en Varadero - Aeropuerto Habana(Roc Varadero / Aeropuerto)", "dateAt": "2022-08-10" }], "passengers": [{ "passengerId": 117, "gender": "MALE", "title": "", "name": "Daniel", "lastname": "Nieto", "dob": "1993-06-01", "document": { "documentType": "DNI", "documentNumber": "93211361C", "expeditionDate": "2022-03-02", "nationality": "ES" }, "country": "ES", "room": "1", "age": 30, "extCode": "1", "type": "ADULT" }, { "passengerId": 118, "gender": "MALE", "title": "", "name": "Sergio", "lastname": "Pedrero", "dob": "1993-06-01", "document": { "documentType": "DNI", "documentNumber": "35635579T", "expeditionDate": "2022-03-02", "nationality": "ES" }, "country": "ES", "room": "1", "age": 30, "extCode": "2", "type": "ADULT" }, { "passengerId": 119, "gender": "MALE", "title": "", "name": "Test", "lastname": "Test", "dob": "2018-03-01", "document": { "documentType": "DNI", "documentNumber": "66968301Y", "expeditionDate": "2021-07-07", "nationality": "ES" }, "country": "ES", "room": "1", "age": 4, "extCode": "3", "type": "CHILD" }], "cancellationPollicies": [{ "text": "En el caso de indicarse gastos en las Observaciones del alojamiento de esta reserva, ese importe será sumando al importe indicado en estas condiciones hasta 7 días antes de la salida.", "type": null, "amount": 0, "toDate": "2022-07-26", "currency": "EUR", "fromDate": "2022-03-17" }, { "text": "Sin gastos de gestión. Del 2022-03-17 hasta 2022-08-03 con un valor de 0 €", "type": "ABSOLUTE", "amount": 0, "toDate": "2022-08-03", "currency": null, "fromDate": "2022-03-17" }, { "text": "10% gastos de penalización 30 días antes la salida. Del 2022-07-04 hasta 2022-07-18 con un valor de 10 %", "type": "PERCENTAGE", "amount": 10, "toDate": "2022-07-18", "currency": null, "fromDate": "2022-07-04" }, { "text": "25% gastos de penalización 15 días antes la salida. Del 2022-07-19 hasta 2022-07-23 con un valor de 25 %", "type": "PERCENTAGE", "amount": 25, "toDate": "2022-07-23", "currency": null, "fromDate": "2022-07-19" }, { "text": "50% gastos de penalización 10 días antes la salida. Del 2022-07-24 hasta 2022-07-26 con un valor de 50 %", "type": "PERCENTAGE", "amount": 50, "toDate": "2022-07-26", "currency": null, "fromDate": "2022-07-24" }, { "text": "100% gastos de penalización 7 días antes la salida. Del 2022-07-27 hasta 2022-08-03 con un valor de 100 %", "type": "PERCENTAGE", "amount": 100, "toDate": "2022-08-03", "currency": null, "fromDate": "2022-07-27" }], "insurances": { "name": "Seguro", "endDate": "2022-08-11", "insured": { "code": "Seguro inclusión", "name": "Seguro inclusión" }, "startDate": "2022-08-03" }, "observations": [{ "text": "TERMINAL SALIDA MADRID:  T1", "type": null }, { "text": "Durante el periodo de afectación por el COVID-19 y debido a los cambios en las normativas de los distintos países, rogamos consultar en su agencia de viajes las restricciones vigentes de entrada a/desde el país de destino. Asimismo, informamos que, en aras de cumplir con dichas normativas, cabe la posibilidad de que algunos servicios hoteleros puedan verse afectados.", "type": null }, { "text": "Para ciudadanos españoles con estancia inferior a 30 días es imprescindible el pasaporte en vigor con una vigencia mínima de 6 meses desde la fecha de entrada al país, billete de regreso y visado de entrada (25) que te podemos tramitar nosotros y que te será entregado en el aeropuerto de Madrid antes del embarque. La tasa de salida del país está incluida en el precio del viaje. Los ciudadanos sin pasaporte europeo y los nacidos en Cuba deberán consultar los requisitos de entrada al país en la Embajada de Cuba.\r\n", "type": null }, { "text": "Desde el 5 de enero para viajar a Cuba se exigen los siguientes requisitos (ambos son necesarios): pauta de vacunación completa + PCR-RT negativo realizado como máximo 72 horas antes del viaje. Están exentos de la pauta de vacunación los niños hasta 12 años y adultos que por causas médicas, debidamente certificadas, no puedan ser vacunados con ninguna de las vacunas aprobadas hasta hoy.   \r\n\r\nAsimismo, todos los pasajeros deben aportar código QR descargado tras completar el formulario sanitario que Cuba ha previsto: https://www.dviajeros.mitrans.gob.cu/inicio ", "type": null }], "hotelRemarks": [{ "text": "<b>Roc Varadero:</b> PENDIENTE FECHA APERTURA." }] }
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
                    Math.min(...data.cancellationPollicies.map((cancellationPolicy) => new Date(cancellationPolicy.fromDate).getMilliseconds())) ===
                    new Date(policy.fromDate).getMilliseconds(),
            );
        const noExpensesPolicy = data.cancellationPollicies.findIndex((policy) => policy['title'].includes('cancelación'));
        const datesInText = data.cancellationPollicies[noExpensesPolicy].text.match(/(\d{1,4}([.\/-])\d{1,2}([.\/-])\d{1,4})/g);
        const date = new Date(lowestDatePolicy.fromDate);
        date.setDate(date.getDate() - 1);
        if (datesInText) {
            data.cancellationPollicies[noExpensesPolicy].text = data.cancellationPollicies[noExpensesPolicy].text.replace(
                datesInText[1],
                new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date),
            );
        }

        //let flowo_email_confirmation = readFileSync('src/notifications/templates/flowo_email_confirmation_transfer.hbs', 'utf8');
        //let template = Handlebars.compile(flowo_email_confirmation);
        //let emailTemplate = template(data);
        /* const email: EmailTemplatedDTO = {
          uuid: uuidv4(),
          applicationName: 'application-code',
          from: 'noreply@myfrom.com',
          to: [chec],
          subject: 'Email test',
          locale: 'es_ES',
          literalProject: 'examples',
          templateCode: 'test-html',
        };
        this.notificationsService.sendMailTemplated(email); */
    }
}