export interface PaymentRequestPatchDTO {
  id: number;
  order_code?: string;
  paid_amount?: number;
  paid_date?: string;
  observation?: string;
  manual_charge_date?: string;
  checkout_id?: string;
  dossier?: number;
  payment_method?: number;
  status?: number;
}

export interface PaymentResponsePatchDTO {
  id: number;
  status_name: string;
  deleted_at: null;
  active: boolean;
  creation_date: string;
  created_by: string;
  update_date: string;
  update_by: string;
  order_code: string;
  paid_amount: number;
  paid_date: string;
  observation: string;
  manual_charge_date: string;
  checkout_id: string;
  dossier: number;
  payment_method: number;
  status: number;
}
