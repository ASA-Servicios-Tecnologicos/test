export interface EmailRawDTO {
  uuid: string;
  applicationName: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  contentType: string;
  urlAttachments: Attachment[];
  rawAttachments: RawAttachment[];
}

export interface Attachment {
  filename: string;
  url: string;
}

export interface RawAttachment {
  filename: string;
  base64: string;
}
