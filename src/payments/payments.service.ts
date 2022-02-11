import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { ManagementHttpService } from 'src/management/services/management-http.service';
import { ClientService } from 'src/management/services/client.service';
import { CreateUpdateDossierPaymentDTO, DossierPayment, InfoDossierPayments } from 'src/shared/dto/dossier-payment.dto';
import { CheckoutService } from 'src/checkout/services/checkout.service';
@Injectable()
export class PaymentsService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService,
    private managementHttpService: ManagementHttpService,
    private checkoutService: CheckoutService,
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
    const dossierPayments: CreateUpdateDossierPaymentDTO = {
      dossier: null,
      bookingId: checkout.booking.bookingId,
      checkoutId: checkout.checkoutId,
      installment: checkout.payment.installments,
      amount: checkout.payment.amount,
    };
    return this.updateDossierPayments(dossierPayments);
  }
}
