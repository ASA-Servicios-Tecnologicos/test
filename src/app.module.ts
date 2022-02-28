import { HttpModule, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { BudgetModule } from './budget/budget.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ClientsModule } from './clients/clients.module';
import { AppConfigModule } from './configuration/configuration.module';
import { AppConfigService } from './configuration/configuration.service';
import { ManagementModule } from './management/management.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { ClientsController } from './clients/clients.controller';
import { CallCenterController } from './call-center/call-center.controller';
import { AuthenticationUserMiddleware } from './middlewares/authenticacion-user.middleware';
import { CallCenterModule } from './call-center/call-center.module';
import { AuthenticationCallCenterMiddleware } from './middlewares/authentication-callcenter.middleware';
import { PaymentsModule } from './payments/payments.module';
import { SharedModule } from './shared/shared.module';
import { CalendarModule } from './calendar/calendar.module';
import { CalendarController } from './calendar/calendar.controller';
import { BookingPackagesModule } from './booking-packages/booking-packages.module';
import { BookingServicesModule } from './booking-services/booking-services.module';
import { BookingServicesFlightsController } from './booking-services/booking-services-flights/booking-services-flights.controller';
import { ManagementSetupModule } from './management/management-setup/management-setup.module';
import { BookingDocumentsModule } from './booking-documents/booking-documents.module';

@Module({
  imports: [
    AppConfigModule,
    SharedModule,
    BookingModule,
    BudgetModule,
    HttpModule,
    CheckoutModule,
    NotificationsModule,
    ManagementModule,
    ClientsModule,
    UsersModule,
    CallCenterModule,
    PaymentsModule,
    CalendarModule,
    BookingPackagesModule,
    BookingServicesModule,
    ManagementSetupModule,
    BookingDocumentsModule,
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(...[AuthenticationUserMiddleware])
      .exclude({ path: 'calendar/ota/reference-prices', method: RequestMethod.POST })
      .forRoutes(ClientsController, CalendarController);
    consumer.apply(...[AuthenticationCallCenterMiddleware]).forRoutes(CallCenterController, BookingServicesFlightsController);
  }
}
