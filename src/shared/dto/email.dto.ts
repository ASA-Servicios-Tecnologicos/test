export interface EmailDTO {
  uuid: string;
  applicationName: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  contentType: 'HTML' | 'TEXT';
  urlAttachments?: Attachment[];
  rawAttachments?: RawAttachment[];
  metadata?: Metadata;
}

export interface Attachment {
  filename: string;
  url: string;
}

export interface RawAttachment {
  filename: string;
  base64: string;
}

export interface Metadata {
  locator?: string;
  number_dossier?: number;
  type?: string;
}

export const HTML_TEMPLATES = {
  CARD: 'src/notifications/templates/flowo_email_confirmation.hbs',
  BANK_TRANSFER: 'src/notifications/templates/flowo_email_confirmation_transfer.hbs',
  CONFIRM_NEWSLETTER: 'src/notifications/templates/subscribed_newsletter.hbs',
  CANCELATION_BOOKING: 'src/notifications/templates/cancelations/flowo_cancel_reservation.hbs',
  SEND_OBSERVATION: 'src/notifications/templates/notificaciones/flowo_email-call-center.hbs',
  BIZUM: 'src/notifications/templates/flowo_email_confirmation.hbs',
};

export enum DossierPaymentMethods {
  'Transferencia bancaria' = 'BANK_TRANSFER',
  'Tarjeta de Credito' = 'CARD',
  'Bizum' = 'BIZUM', //Confirmado
}

export enum TypeEmail {
  'OBSERVATION' = 'OBSERVATION',
  'CANCELATION' = 'CANCELATION',
  'CONFIRMATION' = 'CONFIRMATION',
}

export interface EmailFiltersDTO {
  applications?: string[];
  dateFrom?: string;
  dateTo?: string;
  pagination: EmailPaginationDTO;
  status?: string;
  subject?: string;
  metadata?: Metadata;
  from?: string;
  to?: string;
  cc?: string;
  bcc?: string;
}
export interface EmailPaginationDTO {
  page?: number;
  collectionSize?: number;
  sortOrder?: string;
  sortField?: string;
}
