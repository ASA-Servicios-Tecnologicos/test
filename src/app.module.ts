import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { BudgetModule } from './budget/budget.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ClientsModule } from './clients/clients.module';
import { AppConfigModule } from './configuration/configuration.module';
import { AppConfigService } from './configuration/configuration.service';
import { ManagementModule } from './management/management.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AppConfigModule,
    BookingModule,
    BudgetModule,
    HttpModule,
    CheckoutModule,
    NotificationsModule,
    ManagementModule,
    ClientsModule,
    AuthModule,
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
