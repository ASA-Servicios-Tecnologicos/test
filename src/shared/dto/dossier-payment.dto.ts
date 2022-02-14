import { CheckoutAmount, CheckoutInstallment } from './checkout.dto';

export class CreateUpdateDossierPaymentDTO {
  dossier: number;
  bookingId: string;
  checkoutId: string;
  amount: CheckoutAmount;
  installment: Array<DossierPaymentInstallment>;
}

export class InfoDossierPayments {
  id: number;
  dossier_number: string;
  total_amount: number;
  dossier_payments: Array<DossierPaymentInstallment>;
}

export class DossierPayment {
  id: number;
  paid_amount: number;
  paid_date: string;
  status: string;
}

export class DossierPaymentInstallment {
  dueDate: string;
  amount: CheckoutAmount;
  recurrent: boolean;
  status: string;
}