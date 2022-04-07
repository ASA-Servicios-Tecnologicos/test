import { HttpService, Injectable } from '@nestjs/common';
import { CacheService } from '../../shared/services/cache.service';
import { AppConfigService } from '../../configuration/configuration.service';
import { CheckoutDTO, CreateCheckoutDTO } from '../../shared/dto/checkout.dto';
import { SecuredHttpService } from '../../shared/services/secured-http.service';
import {Model} from "mongoose";
import {Booking, BookingDocument} from "../../shared/model/booking.schema";
import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class CheckoutService extends SecuredHttpService {
  constructor(readonly http: HttpService, readonly appConfigService: AppConfigService, readonly cacheService: CacheService<any>, @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,) {
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

  getCheckoutByDossierId(dossierId: number):string{
    const {checkoutId} = this.bookingModel.findOne({ dossier: dossierId }).projection("checkoutId");
    return checkoutId
  }
}
