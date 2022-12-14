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

  get SESSION_SCOPE(): string {
    return this.configService.get<string>('tecnoturis-app.SESSION_SCOPE');
  }

  get SESSION_GRANT_TYPE(): string {
    return this.configService.get<string>('tecnoturis-app.SESSION_GRANT_TYPE');
  }

  get SESSION_CLIENT_SECRET(): string {
    return this.configService.get<string>('tecnoturis-app.SESSION_CLIENT_SECRET');
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

  get DISCOUNT_CODE_URL(): string {
    return this.configService.get<string>('tecnoturis-app.DISCOUNT_CODE_URL');
  }

  get BASE_URL(): string {
    return this.configService.get<string>('tecnoturis-app.BASE_URL');
  }

  get MANAGEMENT_USERNAME(): string {
    return this.configService.get<string>('tecnoturis-app.MANAGEMENT_USERNAME');
  }

  get MANAGEMENT_PASSWORD(): string {
    return this.configService.get<string>('tecnoturis-app.MANAGEMENT_PASSWORD');
  }

  get W2M_URL(): string {
    return this.configService.get<string>('tecnoturis-app.W2M_URL');
  }

  get CONTENT_URL(): string {
    return this.configService.get<string>('tecnoturis-app.CONTENT_URL');
  }

  get ALLOWED_ORIGINS(): Array<string> {
    const origins = this.configService.get<string>('tecnoturis-app.ALLOWED_ORIGINS');
    if (origins?.length) {
      return this.configService.get<string>('tecnoturis-app.ALLOWED_ORIGINS').split(', ');
    }
    return [];
  }

  get CLIENT_GENERAL(): number {
    return Number(this.configService.get<number>('tecnoturis-app.CLIENT_GENERAL'));
  }
}
