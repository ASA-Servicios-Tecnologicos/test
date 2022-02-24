export interface EmailTemplatedDTO {
  uuid: string;
  applicationName: string;
  from: string;
  to: string[];
  subject: string;
  body: string;
  contentType: 'HTML';
}
