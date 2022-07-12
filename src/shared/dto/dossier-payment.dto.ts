import { CheckoutAmount } from './checkout.dto';
export class CreateUpdateDossierPaymentDTO {
  dossier: number;
  bookingId: string;
  checkoutId: string;
  amount: CheckoutAmount;
  paymentMethods?: number;
  installment: Array<DossierPaymentInstallment>;
}
export class CreateDossierPaymentDTO {
  dossier_id?: number;
  paid_amount?: number;
  paid_date?: string;
  is_update?: boolean;
  status_id?: number;
  payment_method_id?: number;
  observation?: string;
  manual_charge_date?: string;
}
export class UpdateDossierPaymentDTO {
  status_id?: number;
  payment_method_id?: number;
  checkout_id?: string;
  order_code?: string;

  manual_charge_date?: string;
  observation?: string;
}
export class InfoDossierPayments {
  id: number;
  dossier_number: string;
  total_amount: number;
  dossier_payments: Array<DossierPaymentInstallment>;
}

export class InfoPayment {
  id?: number;
  paid_amount?: number;
  paid_date?: string;
  status?: string;
  status_description?: string;
  payment_method?: string;
  observation?: string;
  id_method_payment?: number;
  id_status?: number;
  is_update?: boolean;
  update_by?: string;
  created_by?: string;
  creation_date?: string;
  update_date?: string;
  manual_charge_date?: string;
}
export class DossierPayment {
  id: number;
  order_code?: string;
  paid_amount: number;
  paid_date: string;
  status: string;
  checkout_id?: string;
}
export class DossierPaymentInstallment {
  orderCode?: string;
  dueDate: string;
  amount: CheckoutAmount;
  recurrent: boolean;
  status: string;
  paid_amount?: number;
  paid_date?: string;
  checkoutId?: string;
}
