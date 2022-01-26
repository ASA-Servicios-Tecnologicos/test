import { HttpService, Injectable } from "@nestjs/common";
import { lastValueFrom, map, pluck } from "rxjs";
import { AppConfigService } from "../../configuration/configuration.service";
@Injectable()
export class ManagementService {
  constructor(
    private readonly http: HttpService,
    private readonly appConfigService: AppConfigService
  ) {}

  auth() {
    const authData = new URLSearchParams();
    authData.append("username", this.appConfigService.MANAGEMENT_USERNAME);
    authData.append("password", this.appConfigService.MANAGEMENT_PASSWORD);
    return lastValueFrom(
      this.http
        .post(
          `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/user/auth/token-auth/`,
          authData
        )
        .pipe(map((res) => res.data))
    ).catch((error) => console.log(error));
  }

  /*   async doCheckout(checkout: CheckoutDTO) {
    return this.postSecured(this.appConfigService.CHECKOUT_URL, checkout);
    this.getSessionToken()
  }

  async getCheckout(id: string) {
    return this.getSecured(`${this.appConfigService.CHECKOUT_URL}/${id}`);
  } */
}
