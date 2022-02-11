import { Injectable } from '@nestjs/common';
import { AppConfigService } from './configuration/configuration.service';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: AppConfigService,
  ) {}

  getHello(): string {
    return `
    ApiRest - Tecnoturis - Boilerplate </br> 
    <a href = "${this.configService.HOST}/api">Swagger</a>
    `;
  }
}
