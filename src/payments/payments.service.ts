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
  ) { }

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

  updateDossierPayments(dossierPayments: CreateUpdateDossierPaymentDTO) {
    return this.managementHttpService.put<Array<DossierPayment>>(
      `${this.appConfigService.BASE_URL}/management/api/v1/cash/dossier-payments/${dossierPayments.dossier}/`,
      dossierPayments,
    );
  }

  async updateDossierPaymentsByCheckout(checkoutId: string) {
    const checkout = await this.checkoutService.getCheckout(checkoutId);
    const booking = await this.bookingModel.findOne({ bookingId: checkout.booking.bookingId }).exec();
    const dossierPayments: CreateUpdateDossierPaymentDTO = {
      dossier: booking.dossier,
      bookingId: checkout.booking.bookingId,
      checkoutId: checkout.checkoutId,
      installment: checkout.payment.installments,
      paymentMethods: checkout.payment.methodType === 'CARD' ? 4 : checkout.payment.methodType === 'BANK_TRANSFER' ? 2 : 2,
      amount: checkout.payment.amount,
    };
    const errorPayments = checkout.payment.installments
      .filter((installment) => installment.status !== 'COMPLETED')
      .map((installment, index) => {
        if (installment.status === 'ERROR') {
          return index + 1;
        }
      });

    if (errorPayments.length) {
      this.dossiersService.patchDossierById(booking.dossier, {
        dossier_situation: 7,
        observation: `Ha ocurrido un error en ${errorPayments.length > 1 ? 'los pagos' : 'el pago'} ${errorPayments
          .toString()
          .split(',')
          .join(', ')}`,
      });
    }
    const pendingPayments = checkout.payment.installments.filter((installment) => installment.status !== 'COMPLETED');
    if (!pendingPayments.length) {
      this.sendBonoEmail(booking, checkout.contact, checkout.buyer);
    }
    return this.updateDossierPayments(dossierPayments);
  }

  private sendBonoEmail(booking: Booking, contact: CheckoutContact, buyer: CheckoutBuyer) {
    this.bookingDocumentsService.sendBonoEmail('NBLUE', booking.locator, contact, buyer);
  }
}
