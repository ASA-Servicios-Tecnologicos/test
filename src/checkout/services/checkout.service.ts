import { HttpService, Injectable } from '@nestjs/common';
import { AppConfigService } from '../../configuration/configuration.service';
import { CheckoutDTO } from '../../shared/dto/checkout.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';

@Injectable()
export class CheckoutService extends SecuredHttpService {
  constructor(
    readonly http: HttpService,
    readonly appConfigService: AppConfigService
  ) {
    super(http, appConfigService);
  }
  
  async doCheckout(checkout: CheckoutDTO) {
    return this.postSecured(this.appConfigService.CHECKOUT_URL, checkout);
  }

  async getCheckout(id: string) {
    return this.postSecured(this.appConfigService.CHECKOUT_URL + id);
  }
}
