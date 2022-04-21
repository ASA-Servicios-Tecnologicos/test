import { DossierClientDTO } from "./dossier-client.dto";
import { PrebookingDTO } from "./pre-booking.dto";

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
  locator: string;
  number_dossier: number;
}

export const HTML_TEMPLATES = {
  'CARD': 'src/notifications/templates/flowo_email_confirmation.hbs',
  'BANK_TRANSFER': 'src/notifications/templates/flowo_email_confirmation_transfer.hbs'
}

export enum DossierPaymentMethods {
  "Transferencia bancaria" = 'BANK_TRANSFER',
  "Tarjeta de Credito" = 'CARD'
}
