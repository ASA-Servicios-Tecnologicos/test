import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { DiscountCode, DiscountDTO } from 'src/shared/dto/booking.dto';
import { SecuredHttpService } from 'src/shared/services/secured-http.service';

@Injectable()
export class DiscountCodeService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService) {
    super(http, appConfigService);
  }

  private async find(discountApplied: DiscountDTO): Promise<DiscountDTO> {
    const body: DiscountCode = {
      couponCode: discountApplied.couponCode,
      sellChannel: 'FLOWO',
      brandCode: 'NBLUE',
      bookingDate: new Date().toISOString().slice(0, 10),
    };
    return (await this.postSecured(this.appConfigService.DISCOUND_CODE_URL, body)).data;
  }

  async validate(discountApplied: DiscountDTO, originalAmount: number) {
    const discount = await this.find(discountApplied);
  }

  private calculateOriginalAmount() {}
}
