import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { AppConfigModule } from './configuration/configuration.module';
import { AppConfigService } from './configuration/configuration.service';
import { NotificationService } from './shared/services/notification.service';

@Module({
  imports: [
    AppConfigModule,
    BookingModule,
    HttpModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.MONGODB_URI,
      }),
      inject: [AppConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, NotificationService],
})
export class AppModule {}
