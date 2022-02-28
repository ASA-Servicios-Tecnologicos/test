import { HttpService, Injectable } from '@nestjs/common';
import { GetDocumentsContent } from 'src/shared/dto/booking-documents.dto';
import { AppConfigService } from '../../configuration/configuration.service';
import { SecuredHttpService } from '../../shared/services/secured-http.service';

@Injectable()
export class BookingDocumentsService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService) {
    super(http, appConfigService);
  }

  findDocumentsByBooking(brandCode: string, bookingReference: string) {
    return this.getSecured(
      `${this.appConfigService.W2M_URL}/agency/ttoo-third-document/api/v1/agency/attachments/brands/${brandCode}/bookings/${bookingReference}`,
    );
  }

  findDocumentsContent(documentContent: GetDocumentsContent) {
    return this.getSecured(`${this.appConfigService.W2M_URL}/agency/ttoo-third-document/api/v1/agency/`);
  }

  /* async doCheckout(checkout: CreateCheckoutDTO) {
    return this.postSecured(this.appConfigService.CHECKOUT_URL, checkout);
  }

  async getCheckout(id: string): Promise<CheckoutDTO> {
    return this.getSecured(`${this.appConfigService.CHECKOUT_URL}/${id}`);
  } */
}