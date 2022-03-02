import { HttpService, Injectable } from '@nestjs/common';
import { GetDocumentsContent } from 'src/shared/dto/booking-documents.dto';
import { AppConfigService } from '../../configuration/configuration.service';
import { SecuredHttpService } from '../../shared/services/secured-http.service';

@Injectable()
export class BookingDocumentsService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService) {
    super(http, appConfigService);
  }

  private findDocumentsByBooking(brandCode: string, bookingReference: string): Promise<Array<any>> {
    return this.getSecured(
      `${this.appConfigService.W2M_URL}/agency/ttoo-third-document/api/v1/agency/brands/${brandCode}/bookings/${bookingReference}`,
    );
  }

  private findDocumentsContent(documentContent: GetDocumentsContent) {
    return this.getSecured(`${this.appConfigService.W2M_URL}/agency/ttoo-third-document/api/v1/agency/`, documentContent);
  }

  private findDocumentsContentPacked(documentContent: GetDocumentsContent) {
    return this.getSecured(`${this.appConfigService.W2M_URL}/agency/ttoo-third-document/api/v1/agency/packed`, documentContent);
  }

  async sendBonoEmail(brandCode: string, locator: string) {
    const bonoDocuments = (await this.findDocumentsByBooking(brandCode, locator)).filter((document) => document.type === 'VOUCHER');
    const getContentBody: GetDocumentsContent = {
      bookingReference: locator,
      brandCode: brandCode,
      documentIds: [...bonoDocuments.map((doc) => doc.id)],
    };
    const content = await this.findDocumentsContent(getContentBody);
  }
}
