export interface EmailTemplatedDTO {
  uuid: string;
  applicationName: string;
  from: string;
  to: string[];
  subject: string;
  locale: string;
  literalProject: string;
  templateCode: string;
}
