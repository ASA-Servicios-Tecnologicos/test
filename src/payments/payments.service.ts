import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { ManagementHttpService } from 'src/management/services/management-http.service';
import { ClientService } from 'src/management/services/client.service';
import { CreateUpdateDossierPaymentDTO, DossierPayment, InfoDossierPayments } from 'src/shared/dto/dossier-payment.dto';
import { CheckoutService } from 'src/checkout/services/checkout.service';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from 'src/shared/model/booking.schema';
import { Model } from 'mongoose';
import { BookingDocumentsService } from 'src/booking-documents/services/booking-documents.service';
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
      paymentMethods:
        checkout.payment.paymentMethods[0].code === '1'
          ? 4
          : checkout.payment.paymentMethods[0].code === '2'
          ? 2
          : parseInt(checkout.payment.paymentMethods[0].code),
      amount: checkout.payment.amount,
    };
    this.updateDossierPayments(dossierPayments);
    return this.bookingDocumentsService.findDocumentsByBooking('NBLUE', booking.locator);
    /*     return  */
  }

  private sendBonoEmail() {}
}
