import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
/**
 * Service dealing with app environment variables.
 *
 * @class
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get port(): number {
    return Number(this.configService.get<number>('tecnoturis-app.port'));
  }
  get HOST(): string {
    return this.configService.get<string>('tecnoturis-app.HOST');
  }

  get MONGODB_URI(): string {
    return this.configService.get<string>('tecnoturis-app.MONGODB_URI');
  }

  get SESSION_TOKEN_URL(): string {
    return this.configService.get<string>('tecnoturis-app.SESSION_TOKEN_URL');
  }

  get SESSION_USERNAME(): string {
    return this.configService.get<string>('tecnoturis-app.SESSION_USERNAME');
  }

  get SESSION_PASSWORD(): string {
    return this.configService.get<string>('tecnoturis-app.SESSION_PASSWORD');
  }

  get SESSION_CLIENTID(): string {
    return this.configService.get<string>('tecnoturis-app.SESSION_CLIENTID');
  }

  get EMAIL_RAW_URL(): string {
    return this.configService.get<string>('tecnoturis-app.EMAIL_RAW_URL');
  }

  get EMAIL_TEMPLATED_URL(): string {
    return this.configService.get<string>('tecnoturis-app.EMAIL_TEMPLATED_URL');
  }

  get CHECKOUT_URL(): string {
    return this.configService.get<string>('tecnoturis-app.CHECKOUT_URL');
  }
}
