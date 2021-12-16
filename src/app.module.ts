import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { CheckoutModule } from './checkout/checkout.module';
import { AppConfigModule } from './configuration/configuration.module';
import { AppConfigService } from './configuration/configuration.service';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AppConfigModule,
    BookingModule,
    HttpModule,
    CheckoutModule,
    NotificationsModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.MONGODB_URI,
      }),
      inject: [AppConfigService],
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
