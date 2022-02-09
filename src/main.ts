import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './configuration/configuration.service';
import { l } from './logger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { httpsOptions: { rejectUnauthorized: false } });

  const config = new DocumentBuilder().setTitle('OTA Backend').setDescription('Backend OTA').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get('AppConfigService');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: true });
  await app.listen(appConfig.port);
  l.info(`Server is running in port ${appConfig.port}`);

  // ADD Hot Reload
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  // TODO: Pending to bind the right certificates for production
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
}
bootstrap();
