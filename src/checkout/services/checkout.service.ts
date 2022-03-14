import { HttpService, Injectable } from '@nestjs/common';
import { CacheService } from 'src/shared/services/cache.service';
import { AppConfigService } from '../../configuration/configuration.service';
import { CheckoutDTO, CreateCheckoutDTO } from '../../shared/dto/checkout.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';

@Injectable()
export class CheckoutService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService, readonly cacheService: CacheService<any>) {
    super(http, appConfigService, cacheService);
  }

  async doCheckout(checkout: CreateCheckoutDTO) {
    return this.postSecured(this.appConfigService.CHECKOUT_URL, checkout);
  }

  async getCheckout(id: string): Promise<CheckoutDTO> {
    return this.getSecured(`${this.appConfigService.CHECKOUT_URL}/${id}`);
  }

  cancelCheckout(id: string) {
    return this.postSecured(`${this.appConfigService.CHECKOUT_URL}/${id}/cancel`);
  }
}
