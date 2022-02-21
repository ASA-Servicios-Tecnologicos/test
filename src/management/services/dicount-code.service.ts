import { HttpException, HttpService, HttpStatus, Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/configuration/configuration.service';
import { DiscountCode, DiscountDTO } from 'src/shared/dto/booking.dto';
import { SecuredHttpService } from 'src/shared/services/secured-http.service';

@Injectable()
export class DiscountCodeService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService) {
    super(http, appConfigService);
  }

  private async find(discountApplied: DiscountDTO) {
    const body: DiscountCode = {
      couponCode: discountApplied.couponCode,
      sellChannel: 'FLOWO',
      brandCode: 'NBLUE',
      bookingDate: new Date().toISOString().slice(0, 10),
    };
    return await (
      await this.postSecured(this.appConfigService.DISCOUNT_CODE_URL, body)
    ).data.discount;
  }

  async validate(discountApplied: DiscountDTO, amount: number) {
    const discount = await this.find(discountApplied);
    if (discount?.status && discount?.status !== HttpStatus.OK) {
      throw new HttpException({ message: discount['message'], error: discount['error'] }, discount.status);
    }
    if (discount) {
      if (discount?.amount) {
        return amount - discount?.amount;
      } else if (discount?.rate) {
        return amount - (amount * discount?.rate) / 100;
      }
    }
    return amount;
  }
}
