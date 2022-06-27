import { CreateDossierPaymentDTO, UpdateDossierPaymentDTO, InfoPayment } from './../shared/dto/dossier-payment.dto';
import { HeadersDTO } from './../shared/dto/header.dto';
import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { ManagementHttpService } from 'src/management/services/management-http.service';
import { CreateUpdateDossierPaymentDTO, DossierPayment, InfoDossierPayments } from 'src/shared/dto/dossier-payment.dto';
import { CheckoutService } from 'src/checkout/services/checkout.service';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from 'src/shared/model/booking.schema';
import { Model } from 'mongoose';
import { BookingDocumentsService } from 'src/booking-documents/services/booking-documents.service';
import { DossiersService } from 'src/dossiers/dossiers.service';
import { CheckoutBuyer, CheckoutContact } from 'src/shared/dto/checkout.dto';
import { logger } from '../logger';
@Injectable()
export class PaymentsService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    private managementHttpService: ManagementHttpService,
    private checkoutService: CheckoutService,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
    private bookingDocumentsService: BookingDocumentsService,
    private dossiersService: DossiersService,
  ) {}

  createDossierPayments(dossierPayments: CreateUpdateDossierPaymentDTO) {
    return this.managementHttpService.post<Array<DossierPayment>>(
      `${this.appConfigService.BASE_URL}/management/api/v1/cash/dossier-payments/`,
      dossierPayments,
    );
  }

  getDossierPayments(dossierId: string) {
    return this.managementHttpService.get<InfoDossierPayments>(
      `${this.appConfigService.BASE_URL}/management/api/v1/cash/dossier-payments/${dossierId}/`,
    );
  }

  async updateDossierPayments(dossierPayments: CreateUpdateDossierPaymentDTO, headers?: HeadersDTO) {
    const dossiers = await this.managementHttpService.put<Array<DossierPayment>>(
      // `${this.appConfigService.BASE_URL}/management/api/v1/cash/dossier-payments/${dossierPayments.dossier}/`,
      `${this.appConfigService.BASE_URL}/management/api/v1/cash/dossier-payments/restricted/${dossierPayments.dossier}/`,
      dossierPayments,
      { headers },
    );
    return dossiers;
  }

  async createDossierPaymentByAgente(dossierPayment: CreateDossierPaymentDTO, headers?: HeadersDTO) {
    const dossier = await this.managementHttpService.post<any>(
      `${this.appConfigService.BASE_URL}/management/api/v1/cash/dossier-payments/agente/`,
      dossierPayment,
      { headers },
    );
    return dossier;
  }

  async updateDossierPaymentByAgente(paymentId: string, dossierPayments: UpdateDossierPaymentDTO, headers?: HeadersDTO) {
    const dossiers = await this.managementHttpService.put<any>(
      `${this.appConfigService.BASE_URL}/management/api/v1/cash/dossier-payments/agente/${paymentId}/`,
      dossierPayments,
      { headers },
    );
    return dossiers;
  }

  async updateDossierPaymentsByCheckout(checkoutId: string, searchErrors: boolean  = false) {
    logger.info(`[PaymentsService] [updateDossierPaymentsByCheckout]  init`);

    const checkout = await this.checkoutService.getCheckout(checkoutId);

    const booking = await this.bookingModel.findOne({ bookingId: checkout.booking.bookingId }).exec();

    const dossierPayments: CreateUpdateDossierPaymentDTO = {
      dossier: booking.dossier,
      bookingId: checkout.booking.bookingId,
      checkoutId: checkout.checkoutId,
      installment: checkout.payment.installments,
      paymentMethods: checkout.payment.methodType === 'CARD' ? 4 : 2,
      amount: checkout.payment.amount,
    };

    if(searchErrors){

      const paymentsBD = (await this.getDossierPayments(booking.dossier.toString())).dossier_payments

      const errorPayments = checkout.payment.installments
      .filter((installment) => {

        const payment: InfoPayment = paymentsBD.find((p)=>{
          return p.paid_date == installment.dueDate && p.paid_amount == installment.amount.value;
        });

        return installment.status === 'ERROR' && payment?.status === 'PENDING';

      }).map((installment) => installment.dueDate );

      if (errorPayments.length) {

        const observation = `Ha ocurrido un error en ${errorPayments.length > 1 ? 'los pagos de las fechas' : 'el pago de la fecha'} ${errorPayments.toString().split(',').join(', ')}`;

        await this.dossiersService.patchDossierById(booking.dossier, {
          dossier_situation: 7,
          observation: observation
        })

        logger.warn(`[PaymentsService] [updateDossierPaymentsByCheckout]  ${observation}`);
      }

    }


    // let dossierDto: DossierDto;

    // if (booking && booking.dossier) {
    //   dossierDto = await this.dossiersService.findDossierById(booking.dossier + '');
    // }

    // const pendingPayments = checkout.payment.installments.filter((installment) => installment.status !== 'COMPLETED');
    // if (!pendingPayments.length) {
    //   this.sendBonoEmail(dossierDto?.code, booking, checkout.contact, checkout.buyer);
    // }
    return this.updateDossierPayments(dossierPayments);
  }

  private sendBonoEmail(dossierCode: string, booking: Booking, contact: CheckoutContact, buyer: CheckoutBuyer) {
    this.bookingDocumentsService.sendBonoEmail(dossierCode, 'NBLUE', booking.locator, contact, buyer);
  }
}
