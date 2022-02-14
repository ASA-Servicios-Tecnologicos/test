import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { ManagementHttpService } from 'src/management/services/management-http.service';
import { ClientService } from 'src/management/services/client.service';
import { CreateUpdateDossierPaymentDTO, DossierPayment, InfoDossierPayments } from 'src/shared/dto/dossier-payment.dto';
import { CheckoutService } from 'src/checkout/services/checkout.service';
import { InjectModel } from '@nestjs/mongoose';
import { Booking, BookingDocument } from 'src/shared/model/booking.schema';
import { Model } from 'mongoose';
@Injectable()
export class PaymentsService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    private managementHttpService: ManagementHttpService,
    private checkoutService: CheckoutService,
    @InjectModel(Booking.name)
    private bookingModel: Model<BookingDocument>,
  ) {}

  createDossierPayments(dossierPayments: CreateUpdateDossierPaymentDTO) {
    return this.managementHttpService.post<Array<DossierPayment>>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/cash/dossier-payments/`,
      dossierPayments,
    );
  }

  getDossierPayments(dossierId: string) {
    return this.managementHttpService.get<InfoDossierPayments>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/cash/dossier-payments/${dossierId}/`,
    );
  }

  updateDossierPayments(dossierPayments: CreateUpdateDossierPaymentDTO) {
    return this.managementHttpService.put<Array<DossierPayment>>(
      `${this.appConfigService.MANAGEMENT_URL}/api/v1/cash/dossier-payments/${dossierPayments.dossier}`,
      dossierPayments,
    );
  }

  async updateDossierPaymentsByCheckout(checkoutId: string) {
    //TODO: Llamar al checkout, recoger los payments y actualizarlos en management
    const checkout = await this.checkoutService.getCheckout(checkoutId);
    const booking = await this.bookingModel.findOne({ bookingId: checkout.booking.bookingId }).exec();
    const dossierPayments: CreateUpdateDossierPaymentDTO = {
      dossier: booking.dossier,
      bookingId: checkout.booking.bookingId,
      checkoutId: checkout.checkoutId,
      installment: checkout.payment.installments,
      amount: checkout.payment.amount,
    };
    return this.updateDossierPayments(dossierPayments);
  }
}
