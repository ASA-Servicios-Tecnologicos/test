import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './configuration/configuration.service';
import { l } from './logger';
import * as morgan from 'morgan';


async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: process.env.ENVIRONMENT === 'development' ? ['log', 'debug', 'error', 'verbose', 'warn'] : ['error', 'warn'],
  });
  app.use(morgan("dev"));

  const config = new DocumentBuilder().setTitle('OTA Backend').setDescription('Backend OTA').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Get app config for cors settings and starting the app.
  const appConfig: AppConfigService = app.get('AppConfigService');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({ credentials: true, origin: true });
  await app.listen(appConfig.port);
  l.info(`Server is running in port ${appConfig.port}`);

}
bootstrap();
