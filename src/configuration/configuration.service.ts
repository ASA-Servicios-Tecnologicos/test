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
    return this.configService.get<string>('tecnoturis-app.MONGODB_URI')
  }
}