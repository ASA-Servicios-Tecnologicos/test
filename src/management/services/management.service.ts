import { HttpService, Injectable } from "@nestjs/common";
import { lastValueFrom, map, pluck } from "rxjs";
import { AppConfigService } from "../../configuration/configuration.service";
import fetch from "node-fetch";

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
    return fetch(
      `${this.appConfigService.TECNOTURIS_URL}/management/api/v1/user/auth/token-auth/`,
      { body: authData, method: "post" }
    )
      .then(async (res) => {
        const data = await res.json();
        return data["token"];
      })
      .catch((error) => console.log(error));
  }
}
