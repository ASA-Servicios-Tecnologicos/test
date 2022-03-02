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
}

export interface Attachment {
  filename: string;
  url: string;
}

export interface RawAttachment {
  filename: string;
  base64: string;
}
